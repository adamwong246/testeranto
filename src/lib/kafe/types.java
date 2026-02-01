package kafe;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

// Type variables for BDD input/output types
public interface IbddInAny {
    Object getIinput();
    Object getIsubject();
    Object getIstore();
    Object getIselection();
    Object getThen();
    Object getGiven();
}

public interface IbddOutAny {}

// Test resource configuration
public class ITTestResourceConfiguration {
    public String name;
    public String fs;
    public List<Integer> ports;
    public String browserWsEndpoint;
    public Integer timeout;
    public Integer retries;
    public Map<String, String> environment;
    
    public ITTestResourceConfiguration(
        String name,
        String fs,
        List<Integer> ports,
        String browserWsEndpoint,
        Integer timeout,
        Integer retries,
        Map<String, String> environment
    ) {
        this.name = name;
        this.fs = fs;
        this.ports = ports;
        this.browserWsEndpoint = browserWsEndpoint;
        this.timeout = timeout;
        this.retries = retries;
        this.environment = environment;
    }
}

// Test adapter interface
public interface ITestAdapter {
    Object beforeAll(Object input, ITTestResourceConfiguration tr, Object pm);
    Object afterAll(Object store, Object pm);
    Object beforeEach(Object subject, Object initializer, ITTestResourceConfiguration testResource, 
                     Object initialValues, Object pm);
    Object afterEach(Object store, String key, Object pm);
    Object andWhen(Object store, Object whenCb, Object testResource, Object pm);
    Object butThen(Object store, Object thenCb, Object testResource, Object pm);
    boolean assertThis(Object t);
}

// Test specification function type
public interface ITestSpecification {
    Object apply(Object suites, Object givens, Object whens, Object thens);
}

// Test implementation structure
public class ITestImplementation {
    public Map<String, Object> suites;
    public Map<String, Function<Object, Object>> givens;
    public Map<String, Function<Object, Function<Object, Object>>> whens;
    public Map<String, Function<Object, Function<Object, Object>>> thens;
    
    public ITestImplementation(
        Map<String, Object> suites,
        Map<String, Function<Object, Object>> givens,
        Map<String, Function<Object, Function<Object, Object>>> whens,
        Map<String, Function<Object, Function<Object, Object>>> thens
    ) {
        this.suites = suites;
        this.givens = givens;
        this.whens = whens;
        this.thens = thens;
    }
}

// Test resource request
public class ITTestResourceRequest {
    public int ports;
    
    public ITTestResourceRequest(int ports) {
        this.ports = ports;
    }
}

// Final results
public class IFinalResults {
    public boolean failed;
    public int fails;
    public List<Object> artifacts;
    public List<String> features;
    
    public IFinalResults(boolean failed, int fails, List<Object> artifacts, List<String> features) {
        this.failed = failed;
        this.fails = fails;
        this.artifacts = artifacts;
        this.features = features;
    }
}
