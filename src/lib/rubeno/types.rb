module Rubeno
  # Type definitions for Rubeno
  
  # Test resource configuration
  class ITTestResourceConfiguration
    attr_accessor :name, :fs, :ports, :browser_ws_endpoint, :timeout, :retries, :environment
    
    def initialize(name:, fs:, ports:, browser_ws_endpoint: nil, timeout: nil, retries: nil, environment: {})
      @name = name
      @fs = fs
      @ports = ports
      @browser_ws_endpoint = browser_ws_endpoint
      @timeout = timeout
      @retries = retries
      @environment = environment
    end
  end
  
  # Test adapter interface
  module ITestAdapter
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
      store
    end
    
    def but_then(store, then_cb, test_resource, pm)
      store
    end
    
    def assert_this(t)
      !!t
    end
  end
  
  # Test specification function type
  ITestSpecification = Proc
  
  # Test implementation structure
  class ITestImplementation
    attr_accessor :suites, :givens, :whens, :thens
    
    def initialize(suites:, givens:, whens:, thens:)
      @suites = suites
      @givens = givens
      @whens = whens
      @thens = thens
    end
  end
  
  # Test resource request
  class ITTestResourceRequest
    attr_accessor :ports
    
    def initialize(ports: 0)
      @ports = ports
    end
  end
  
  # Final results
  class IFinalResults
    attr_accessor :failed, :fails, :artifacts, :features
    
    def initialize(failed:, fails:, artifacts:, features:)
      @failed = failed
      @fails = fails
      @artifacts = artifacts
      @features = features
    end
  end
end
