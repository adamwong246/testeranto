package kafe;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public abstract class BaseSuite {
    public String name;
    public Map<String, BaseGiven> givens;
    public Object store;
    public ITTestResourceConfiguration testResourceConfiguration;
    public int index;
    public boolean failed;
    public int fails;
    public List<String> artifacts;
    
    public BaseSuite(String name, Map<String, BaseGiven> givens) {
        this.name = name;
        this.givens = givens != null ? givens : new HashMap<>();
        this.artifacts = new ArrayList<>();
        this.failed = false;
        this.fails = 0;
    }
    
    public void addArtifact(String path) {
        String normalizedPath = path.replace('\\', '/');
        this.artifacts.add(normalizedPath);
    }
    
    public List<String> features() {
        List<String> features = new ArrayList<>();
        Map<String, Boolean> seen = new HashMap<>();
        
        for (BaseGiven given : givens.values()) {
            if (given.features != null) {
                for (String feature : given.features) {
                    if (!seen.containsKey(feature)) {
                        features.add(feature);
                        seen.put(feature, true);
                    }
                }
            }
        }
        return features;
    }
    
    public Map<String, Object> toObj() {
        List<Map<String, Object>> givenObjs = new ArrayList<>();
        for (BaseGiven given : givens.values()) {
            givenObjs.add(given.toObj());
        }
        
        Map<String, Object> obj = new HashMap<>();
        obj.put("name", name);
        obj.put("givens", givenObjs);
        obj.put("fails", fails);
        obj.put("failed", failed);
        obj.put("features", features());
        obj.put("artifacts", artifacts);
        return obj;
    }
    
    public abstract Object setup(Object s, Function<String, Object> artifactory, 
                                ITTestResourceConfiguration tr, Object pm);
    
    public abstract boolean assertThat(Object t);
    
    public abstract Object afterAll(Object store, Function<String, Object> artifactory, Object pm);
    
    public Object run(Object input, ITTestResourceConfiguration testResourceConfiguration,
                     Function<String, Object> artifactory, Function<String, Void> tLog, Object pm) {
        this.testResourceConfiguration = testResourceConfiguration;
        
        Function<String, Object> suiteArtifactory = (fPath) -> {
            return artifactory.apply("suite-" + index + "-" + name + "/" + fPath);
        };
        
        Object subject = setup(input, suiteArtifactory, testResourceConfiguration, pm);
        
        fails = 0;
        failed = false;
        
        for (Map.Entry<String, BaseGiven> entry : givens.entrySet()) {
            String gKey = entry.getKey();
            BaseGiven g = entry.getValue();
            try {
                store = g.give(subject, gKey, testResourceConfiguration, this::assertThat,
                              suiteArtifactory, tLog, pm, index);
                if (g.failed) {
                    fails++;
                }
            } catch (Exception e) {
                failed = true;
                fails++;
                System.err.println("Error in given " + gKey + ": " + e.getMessage());
            }
        }
        
        if (fails > 0) {
            failed = true;
        }
        
        try {
            afterAll(store, artifactory, pm);
        } catch (Exception e) {
            System.err.println("Error in after_all: " + e.getMessage());
        }
        
        return this;
    }
}
