import java.util.function.Function;

public class CalculatorKafeAdapter {
    
    public Object beforeAll(Object input, Object testResource) {
        return input;
    }
    
    public Object afterAll(Object store) {
        return store;
    }
    
    public Object beforeEach(Object subject, Object initializer, Object testResource, Object initialValues) {
        // The initializer should be a function that returns a Calculator instance
        if (initializer instanceof Function) {
            @SuppressWarnings("unchecked")
            Function<Void, Calculator> func = (Function<Void, Calculator>) initializer;
            return func.apply(null);
        }
        return new Calculator();
    }
    
    public Object afterEach(Object store, String key) {
        return store;
    }
    
    public Object andWhen(Object store, Object whenCB, Object testResource) {
        // whenCB is a function that takes Calculator and returns Calculator
        if (whenCB instanceof Function) {
            @SuppressWarnings("unchecked")
            Function<Calculator, Calculator> func = (Function<Calculator, Calculator>) whenCB;
            return func.apply((Calculator) store);
        }
        return store;
    }
    
    public Object butThen(Object store, Object thenCB, Object testResource) {
        // thenCB is a function that takes Calculator and returns Boolean
        if (thenCB instanceof Function) {
            @SuppressWarnings("unchecked")
            Function<Calculator, Boolean> func = (Function<Calculator, Boolean>) thenCB;
            return func.apply((Calculator) store);
        }
        return false;
    }
    
    public boolean assertThis(Object actual) {
        if (actual instanceof Boolean) {
            return (Boolean) actual;
        }
        return false;
    }
}
