module Rubeno
  class BaseThen
    attr_accessor :name, :then_cb, :error, :artifacts, :status
    
    def initialize(name, then_cb)
      @name = name
      @then_cb = then_cb
      @error = false
      @artifacts = []
    end
    
    def add_artifact(path)
      normalized_path = path.gsub('\\', '/')
      @artifacts << normalized_path
    end
    
    def but_then(store, then_cb, test_resource_configuration, pm)
      raise NotImplementedError, "but_then must be implemented by subclasses"
    end
    
    def to_obj
      {
        name: @name,
        error: @error,
        artifacts: @artifacts,
        status: @status
      }
    end
    
    def test(store, test_resource_configuration, t_log, pm, filepath)
      begin
        # Call the then_cb with the store to get a boolean result
        result = @then_cb.call(store)
        @status = true
        result
      rescue => e
        @status = false
        @error = true
        raise e
      end
    end
  end
end
