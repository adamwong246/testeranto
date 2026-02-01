package kafe;

public class SimpleTestAdapter implements ITestAdapter {
    @Override
    public Object beforeAll(Object input, ITTestResourceConfiguration tr, Object pm) {
        return input;
    }
    
    @Override
    public Object afterAll(Object store, Object pm) {
        return store;
    }
    
    @Override
    public Object beforeEach(Object subject, Object initializer, ITTestResourceConfiguration testResource, 
                            Object initialValues, Object pm) {
        return subject;
    }
    
    @Override
    public Object afterEach(Object store, String key, Object pm) {
        return store;
    }
    
    @Override
    public Object andWhen(Object store, Object whenCb, Object testResource, Object pm) {
        // In a real implementation, we would call whenCb with store
        // For now, just return store
        return store;
    }
    
    @Override
    public Object butThen(Object store, Object thenCb, Object testResource, Object pm) {
        // In a real implementation, we would call thenCb with store
        // For now, just return store
        return store;
    }
    
    @Override
    public boolean assertThis(Object t) {
        // Simple implementation
        return true;
    }
}
