module Rubeno
  class BaseGiven
    attr_accessor :features, :whens, :thens, :error, :fail, :store, :recommended_fs_path,
                  :given_cb, :initial_values, :key, :failed, :artifacts, :status, :fails
    
    def initialize(features, whens, thens, given_cb, initial_values)
      @features = features
      @whens = whens
      @thens = thens
      @given_cb = given_cb
      @initial_values = initial_values
      @artifacts = []
      @fails = 0
    end
    
    def add_artifact(path)
      normalized_path = path.gsub('\\', '/')
      @artifacts << normalized_path
    end
    
    def before_all(store)
      store
    end
    
    def to_obj
      {
        key: @key,
        whens: (@whens || []).map { |w| w.respond_to?(:to_obj) ? w.to_obj : {} },
        thens: (@thens || []).map { |t| t.respond_to?(:to_obj) ? t.to_obj : {} },
        error: @error ? [@error, @error.backtrace] : nil,
        failed: @failed,
        features: @features || [],
        artifacts: @artifacts,
        status: @status
      }
    end
    
    def given_that(subject, test_resource_configuration, artifactory, given_cb, initial_values, pm)
      raise NotImplementedError, "given_that must be implemented by subclasses"
    end
    
    def after_each(store, key, artifactory, pm)
      store
    end
    
    def give(subject, key, test_resource_configuration, tester, artifactory, t_log, pm, suite_ndx)
      @key = key
      @fails = 0
      @failed = false
      @error = nil
      
      given_artifactory = ->(f_path, value) do
        artifactory.call("given-#{key}/#{f_path}", value)
      end
      
      begin
        # Call the given callback to get initial subject
        initial_subject = @given_cb.call(@initial_values)
        @store = given_that(
          initial_subject,
          test_resource_configuration,
          given_artifactory,
          @given_cb,
          @initial_values,
          pm
        )
        @status = true
      rescue => e
        @status = false
        @failed = true
        @fails += 1
        @error = e
        return @store
      end
      
      begin
        # Process whens
        @whens.each_with_index do |when_step, when_ndx|
          begin
            @store = when_step.test(
              @store,
              test_resource_configuration,
              t_log,
              pm,
              "suite-#{suite_ndx}/given-#{key}/when/#{when_ndx}"
            )
          rescue => e
            @failed = true
            @fails += 1
            @error = e
          end
        end
        
        # Process thens
        @thens.each_with_index do |then_step, then_ndx|
          begin
            result = then_step.test(
              @store,
              test_resource_configuration,
              t_log,
              pm,
              "suite-#{suite_ndx}/given-#{key}/then-#{then_ndx}"
            )
            unless tester.call(result)
              @failed = true
              @fails += 1
            end
          rescue => e
            @failed = true
            @fails += 1
            @error = e
          end
        end
      rescue => e
        @error = e
        @failed = true
        @fails += 1
      ensure
        begin
          after_each(@store, @key, given_artifactory, pm)
        rescue => e
          @failed = true
          @fails += 1
        end
      end
      
      @store
    end
  end
end
