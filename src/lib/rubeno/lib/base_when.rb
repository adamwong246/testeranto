module Rubeno
  class BaseWhen
    attr_accessor :name, :when_cb, :error, :artifacts, :status
    
    def initialize(name, when_cb)
      @name = name
      @when_cb = when_cb
      @artifacts = []
    end
    
    def add_artifact(path)
      normalized_path = path.gsub('\\', '/')
      @artifacts << normalized_path
    end
    
    def and_when(store, when_cb, test_resource_configuration, pm)
      raise NotImplementedError, "and_when must be implemented by subclasses"
    end
    
    def to_obj
      error_str = nil
      if @error
        error_str = "#{@error.class}: #{@error.message}"
      end
      {
        name: @name,
        status: @status,
        error: error_str,
        artifacts: @artifacts
      }
    end
    
    def test(store, test_resource_configuration, t_log, pm, filepath)
      begin
        # Call the when_cb with the store
        result = @when_cb.call(store)
        @status = true
        result
      rescue => e
        @status = false
        @error = e
        raise e
      end
    end
  end
end
