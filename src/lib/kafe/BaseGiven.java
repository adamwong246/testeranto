package kafe;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public abstract class BaseGiven {
    public String key;
    public List<String> features;
    public List<BaseWhen> whens;
    public List<BaseThen> thens;
    public Object givenCb;
    public Object initialValues;
    public List<String> artifacts;
    public Exception error;
    public boolean failed;
    public Object store;
    public int fails;
    
    public BaseGiven(String key, List<String> features, List<BaseWhen> whens, 
                    List<BaseThen> thens, Object givenCb, Object initialValues) {
        this.key = key;
        this.features = features != null ? features : new ArrayList<>();
        this.whens = whens != null ? whens : new ArrayList<>();
        this.thens = thens != null ? thens : new ArrayList<>();
        this.givenCb = givenCb;
        this.initialValues = initialValues;
        this.artifacts = new ArrayList<>();
        this.failed = false;
        this.fails = 0;
    }
    
    public void addArtifact(String path) {
        String normalizedPath = path.replace('\\', '/');
        artifacts.add(normalizedPath);
    }
    
    public Map<String, Object> toObj() {
        List<Map<String, Object>> whenObjs = new ArrayList<>();
        for (BaseWhen w : whens) {
            whenObjs.add(w.toObj());
        }
        
        List<Map<String, Object>> thenObjs = new ArrayList<>();
        for (BaseThen t : thens) {
            thenObjs.add(t.toObj());
        }
        
        Map<String, Object> obj = new HashMap<>();
        obj.put("key", key);
        obj.put("whens", whenObjs);
        obj.put("thens", thenObjs);
        obj.put("error", error != null ? error.getMessage() : null);
        obj.put("failed", failed);
        obj.put("features", features);
        obj.put("artifacts", artifacts);
        obj.put("status", !failed);
        return obj;
    }
    
    public abstract Object givenThat(Object subject, ITTestResourceConfiguration testResourceConfiguration,
                                   Function<String, Object> artifactory, Object givenCb, 
                                   Object initialValues, Object pm);
    
    public abstract Object afterEach(Object store, String key, 
                                   Function<String, Object> artifactory, Object pm);
    
    public void uberCatcher(Exception e) {
        this.error = e;
    }
    
    public Object give(Object subject, String key, ITTestResourceConfiguration testResourceConfiguration,
                      Function<Object, Boolean> tester, Function<String, Object> artifactory,
                      Function<String, Void> tLog, Object pm, int suiteNdx) throws Exception {
        this.failed = false;
        tLog.apply("\n " + key);
        tLog.apply("\n Given: " + this.key);
        
        Function<String, Object> givenArtifactory = (fPath) -> {
            return artifactory.apply("given-" + key + "/" + fPath);
        };
        
        try {
            store = givenThat(subject, testResourceConfiguration, givenArtifactory, 
                             givenCb, initialValues, pm);
        } catch (Exception e) {
            failed = true;
            error = e;
            throw e;
        }
        
        try {
            // Process whens
            for (int whenNdx = 0; whenNdx < whens.size(); whenNdx++) {
                BaseWhen whenStep = whens.get(whenNdx);
                try {
                    store = whenStep.test(store, testResourceConfiguration);
                } catch (Exception e) {
                    failed = true;
                    error = e;
                }
            }
            
            // Process thens
            for (int thenNdx = 0; thenNdx < thens.size(); thenNdx++) {
                BaseThen thenStep = thens.get(thenNdx);
                try {
                    Object result = thenStep.test(store, testResourceConfiguration);
                    if (!tester.apply(result)) {
                        failed = true;
                        fails++;
                    }
                } catch (Exception e) {
                    failed = true;
                    fails++;
                    error = e;
                }
            }
        } catch (Exception e) {
            error = e;
            failed = true;
            fails++;
        } finally {
            try {
                afterEach(store, this.key, givenArtifactory, pm);
            } catch (Exception e) {
                failed = true;
                fails++;
            }
        }
        
        return store;
    }
}
