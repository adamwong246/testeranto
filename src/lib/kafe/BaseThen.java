package kafe;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class BaseThen {
    public String name;
    public Object thenCb;
    public boolean error;
    public List<String> artifacts;
    public Boolean status;
    
    public BaseThen(String name, Object thenCb) {
        this.name = name;
        this.thenCb = thenCb;
        this.error = false;
        this.artifacts = new ArrayList<>();
        this.status = null;
    }
    
    public void addArtifact(String path) {
        String normalizedPath = path.replace('\\', '/');
        artifacts.add(normalizedPath);
    }
    
    public abstract Object butThen(Object store, Object thenCb, ITTestResourceConfiguration testResourceConfiguration);
    
    public Map<String, Object> toObj() {
        Map<String, Object> obj = new HashMap<>();
        obj.put("name", name);
        obj.put("error", error);
        obj.put("artifacts", artifacts);
        obj.put("status", status);
        return obj;
    }
    
    public Object test(Object store, ITTestResourceConfiguration testResourceConfiguration) throws Exception {
        try {
            Object result = butThen(store, thenCb, testResourceConfiguration);
            status = true;
            return result;
        } catch (Exception e) {
            status = false;
            error = true;
            throw e;
        }
    }
}
