module Rubeno
  class BaseSuite
    attr_accessor :name, :givens, :store, :test_resource_configuration, :index, :failed, :fails, :artifacts
    
    def initialize(name, givens = {})
      @name = name
      @givens = givens
      @artifacts = []
      @failed = false
      @fails = 0
    end
    
    def add_artifact(path)
      normalized_path = path.gsub('\\', '/')
      @artifacts << normalized_path
    end
    
    def features
      features = []
      seen = {}
      @givens.each_value do |given|
        given.features.each do |feature|
          unless seen[feature]
            features << feature
            seen[feature] = true
          end
        end
      end
      features
    end
    
    def to_obj
      {
        name: @name,
        givens: @givens.values.map(&:to_obj),
        fails: @fails,
        failed: @failed,
        features: features,
        artifacts: @artifacts
      }
    end
    
    def setup(s, artifactory, tr, pm)
      s
    end
    
    def assert_that(t)
      !!t
    end
    
    def after_all(store, artifactory, pm)
      store
    end
    
    def run(input_val, test_resource_configuration, artifactory, t_log, pm)
      @test_resource_configuration = test_resource_configuration
      
      subject = setup(input_val, artifactory, test_resource_configuration, pm)
      
      @fails = 0
      @failed = false
      
      @givens.each do |g_key, g|
        begin
          @store = g.give(
            subject,
            g_key,
            test_resource_configuration,
            method(:assert_that),
            artifactory,
            t_log,
            pm,
            @index
          )
          @fails += g.fails if g.fails && g.fails > 0
        rescue => e
          @failed = true
          @fails += 1
          puts "Error in given #{g_key}: #{e.message}"
        end
      end
      
      @failed = true if @fails > 0
      
      begin
        after_all(@store, artifactory, pm)
      rescue => e
        puts "Error in after_all: #{e.message}"
      end
      
      self
    end
  end
end
