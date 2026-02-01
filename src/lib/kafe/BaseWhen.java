package kafe;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class BaseWhen {
    public String name;
    public Object whenCb;
    public Exception error;
    public List<String> artifacts;
    public Boolean status;
    
    public BaseWhen(String name, Object whenCb) {
        this.name = name;
        this.whenCb = whenCb;
        this.artifacts = new ArrayList<>();
        this.status = null;
    }
    
    public void addArtifact(String path) {
        if (!(path instanceof String)) {
            throw new RuntimeException(
                "[ARTIFACT ERROR] Expected string, got " + path.getClass().getName() + ": " + path
            );
        }
        String normalizedPath = path.replace('\\', '/');
        artifacts.add(normalizedPath);
    }
    
    public abstract Object andWhen(Object store, Object whenCb, ITTestResourceConfiguration testResourceConfiguration);
    
    public Map<String, Object> toObj() {
        String errorStr = null;
        if (error != null) {
            errorStr = error.getClass().getName() + ": " + error.getMessage();
        }
        Map<String, Object> obj = new HashMap<>();
        obj.put("name", name);
        obj.put("status", status);
        obj.put("error", errorStr);
        obj.put("artifacts", artifacts);
        return obj;
    }
    
    public Object test(Object store, ITTestResourceConfiguration testResourceConfiguration) throws Exception {
        try {
            Object result = andWhen(store, whenCb, testResourceConfiguration);
            status = true;
            return result;
        } catch (Exception e) {
            status = false;
            error = e;
            throw e;
        }
    }
}
