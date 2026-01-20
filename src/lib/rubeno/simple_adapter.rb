module Rubeno
  class SimpleTestAdapter
    include ITestAdapter
    
    def before_all(input_val, tr, pm)
      input_val
    end
    
    def after_all(store, pm)
      store
    end
    
    def before_each(subject, initializer, test_resource, initial_values, pm)
      subject
    end
    
    def after_each(store, key, pm)
      store
    end
    
    def and_when(store, when_cb, test_resource, pm)
      if when_cb.respond_to?(:call)
        when_cb.call(store)
      else
        store
      end
    end
    
    def but_then(store, then_cb, test_resource, pm)
      if then_cb.respond_to?(:call)
        then_cb.call(store)
      else
        store
      end
    end
    
    def assert_this(t)
      !!t
    end
  end
end
