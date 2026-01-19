require 'json'
require_relative 'base_suite'
require_relative 'base_given'
require_relative 'base_when'
require_relative 'base_then'
require_relative 'simple_adapter'
require_relative 'pm/ruby'
require_relative 'types'

module Rubeno
  class Rubeno
    attr_accessor :test_resource_requirement, :artifacts, :test_jobs, :test_specification,
                  :suites_overrides, :given_overrides, :when_overrides, :then_overrides,
                  :puppet_master, :specs, :total_tests, :assert_this, :test_adapter,
                  :test_subject
    
    def initialize(input_val, test_specification, test_implementation, test_resource_requirement, test_adapter, uber_catcher = nil)
      @test_resource_requirement = test_resource_requirement
      @artifacts = []
      @test_jobs = []
      @test_specification = test_specification
      @suites_overrides = {}
      @given_overrides = {}
      @when_overrides = {}
      @then_overrides = {}
      @test_subject = input_val
      @test_adapter = test_adapter
      
      # Initialize classy implementations
      initialize_classy_implementations(test_implementation)
      
      # Generate specs
      @specs = test_specification.call(
        suites_wrapper,
        given_wrapper,
        when_wrapper,
        then_wrapper
      )
      
      # Initialize test jobs
      initialize_test_jobs
    end
    
    def suites_wrapper
      # Return an object that responds to method calls for suite types
      wrapper = Object.new
      @suites_overrides.each do |suite_name, suite_proc|
        wrapper.define_singleton_method(suite_name) do |description, givens_dict|
          {
            'name' => description,
            'givens' => givens_dict
          }
        end
      end
      wrapper
    end
    
    def given_wrapper
      wrapper = Object.new
      @given_overrides.each do |given_name, given_proc|
        wrapper.define_singleton_method(given_name) do |features, whens, thens, initial_values = nil|
          given_proc.call(features, whens, thens, initial_values)
        end
      end
      wrapper
    end
    
    def when_wrapper
      wrapper = Object.new
      @when_overrides.each do |when_name, when_proc|
        wrapper.define_singleton_method(when_name) do |*args|
          when_proc.call(*args)
        end
      end
      wrapper
    end
    
    def then_wrapper
      wrapper = Object.new
      @then_overrides.each do |then_name, then_proc|
        wrapper.define_singleton_method(then_name) do |*args|
          then_proc.call(*args)
        end
      end
      wrapper
    end
    
    def initialize_classy_implementations(test_implementation)
      # Create classy givens
      test_implementation.givens.each do |key, given_cb|
        @given_overrides[key] = ->(features, whens, thens, initial_values = nil) do
          BaseGiven.new(features, whens, thens, given_cb, initial_values)
        end
      end
      
      # Create classy whens
      test_implementation.whens.each do |key, when_cb_proc|
        @when_overrides[key] = ->(*args) do
          when_cb = when_cb_proc.call(*args)
          BaseWhen.new(key, when_cb)
        end
      end
      
      # Create classy thens
      test_implementation.thens.each do |key, then_cb_proc|
        @then_overrides[key] = ->(*args) do
          then_cb = then_cb_proc.call(*args)
          BaseThen.new(key, then_cb)
        end
      end
    end
    
    def initialize_test_jobs
      @test_jobs = []
      @specs.each_with_index do |suite_spec, i|
        # Create a BaseSuite instance
        suite = BaseSuite.new(suite_spec['name'], suite_spec['givens'])
        suite.index = i
        
        # Create a test job
        test_job = {
          suite: suite,
          receiveTestResourceConfig: ->(pm, test_resource_config) { run_test_job(suite, pm, test_resource_config) },
          to_obj: -> { suite.to_obj }
        }
        
        @test_jobs << test_job
      end
    end
    
    def run_test_job(suite, pm, test_resource_config)
      t_log = ->(*args) { puts args.join(' ') }
      
      # Run the suite
      suite_done = suite.run(
        @test_subject,
        test_resource_config,  # Use the actual test resource configuration
        ->(f_path, value) { nil },  # Simple artifactory
        t_log,
        pm
      )
      
      # Create result object
      result = Object.new
      result.instance_variable_set(:@fails, suite_done.fails)
      result.instance_variable_set(:@artifacts, suite_done.artifacts)
      result.instance_variable_set(:@features, suite_done.features)
      
      def result.fails; @fails; end
      def result.artifacts; @artifacts; end
      def result.features; @features; end
      
      result
    rescue => e
      puts "Error in test job: #{e.message}"
      puts e.backtrace
      
      result = Object.new
      result.instance_variable_set(:@fails, 1)
      result.instance_variable_set(:@artifacts, [])
      result.instance_variable_set(:@features, [])
      
      def result.fails; @fails; end
      def result.artifacts; @artifacts; end
      def result.features; @features; end
      
      result
    end
    
    def receiveTestResourceConfig(partialTestResource, websocket_port = 'ipcfile')
      # Parse the test resource configuration
      test_resource_config = parse_test_resource_config(partialTestResource)
      
      pm = PM_Ruby.new(test_resource_config, websocket_port)
      
      # Run all test jobs
      total_fails = 0
      all_features = []
      all_artifacts = []
      suite_results = []
      
      @test_jobs.each do |job|
        begin
          # Update the job's receiveTestResourceConfig to pass test_resource_config
          result = run_test_job(job[:suite], pm, test_resource_config)
          total_fails += result.fails
          all_features.concat(result.features)
          all_artifacts.concat(result.artifacts)
          suite_results << job[:to_obj].call
        rescue => e
          puts "Error running test job: #{e.message}"
          total_fails += 1
        end
      end
      
      # Write tests.json
      write_tests_json(suite_results, total_fails, all_features.uniq, all_artifacts)
      
      # Return result
      IFinalResults.new(
        failed: total_fails > 0,
        fails: total_fails,
        artifacts: all_artifacts,
        features: all_features.uniq
      )
    end
    
    private
    
    def parse_test_resource_config(partialTestResource)
      begin
        config = JSON.parse(partialTestResource)
        # Create a hash that can be used as test resource configuration
        # The PM_Ruby expects certain methods to be available
        config_hash = {
          'name' => config['name'] || 'default',
          'fs' => config['fs'] || '.',
          'ports' => config['ports'] || [],
          'timeout' => config['timeout'] || 30000,
          'retries' => config['retries'] || 0,
          'environment' => config['environment'] || {}
        }
        # Create an object that responds to the needed methods
        test_resource = Object.new
        test_resource.define_singleton_method(:name) { config_hash['name'] }
        test_resource.define_singleton_method(:fs) { config_hash['fs'] }
        test_resource.define_singleton_method(:ports) { config_hash['ports'] }
        test_resource.define_singleton_method(:timeout) { config_hash['timeout'] }
        test_resource.define_singleton_method(:retries) { config_hash['retries'] }
        test_resource.define_singleton_method(:environment) { config_hash['environment'] }
        test_resource
      rescue JSON::ParserError
        # If not valid JSON, create a default config
        test_resource = Object.new
        test_resource.define_singleton_method(:name) { 'default' }
        test_resource.define_singleton_method(:fs) { '.' }
        test_resource.define_singleton_method(:ports) { [] }
        test_resource.define_singleton_method(:timeout) { 30000 }
        test_resource.define_singleton_method(:retries) { 0 }
        test_resource.define_singleton_method(:environment) { {} }
        test_resource
      end
    end
    
    def write_tests_json(suite_results, total_fails, features, artifacts)
      # Flatten all givens from all suites
      all_givens = []
      suite_results.each do |suite|
        if suite[:givens]
          all_givens.concat(suite[:givens])
        end
      end
      
      tests_data = {
        'name' => @specs.first ? @specs.first['name'] : 'Unnamed Test',
        'givens' => all_givens,
        'fails' => total_fails,
        'failed' => total_fails > 0,
        'features' => features,
        'artifacts' => artifacts
      }
      
      # Create directory if it doesn't exist
      dir_path = 'testeranto/reports/allTests/example'
      FileUtils.mkdir_p(dir_path) unless Dir.exist?(dir_path)
      
      # Write to file
      tests_json_path = "#{dir_path}/ruby.Calculator.test.ts.json"
      File.write(tests_json_path, JSON.pretty_generate(tests_data))
      puts "tests.json written to: #{tests_json_path}"
    end
  end
  
  # Main function
  def self.main
    puts "Rubeno Ruby implementation"
    
    # Check command line arguments
    if ARGV.length < 1
      puts "No test arguments provided - exiting"
      exit 0
    end
    
    partialTestResource = ARGV[0]
    websocket_port = ARGV[1] || 'ipcfile'
    
    # We need a default instance to run
    # In a real implementation, this would be set elsewhere
    if $default_rubeno_instance.nil?
      puts "ERROR: No default Rubeno instance has been configured"
      exit -1
    end
    
    result = $default_rubeno_instance.receiveTestResourceConfig(partialTestResource, websocket_port)
    exit result.fails
  end
  
  # Store the default instance
  $default_rubeno_instance = nil
  
  def self.set_default_instance(instance)
    $default_rubeno_instance = instance
  end
  
  # Helper function to create a Rubeno instance
  def self.Rubeno(input_val = nil, test_specification = nil, test_implementation = nil, test_adapter = nil, test_resource_requirement = nil, uber_catcher = nil)
    instance = Rubeno.new(
      input_val,
      test_specification,
      test_implementation,
      test_resource_requirement || ITTestResourceRequest.new,
      test_adapter || SimpleTestAdapter.new,
      uber_catcher
    )
    instance
  end
end
