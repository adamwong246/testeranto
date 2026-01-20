import java.util.*;
import java.util.function.Function;

public class CalculatorKafeImplementation {
    
    public Map<String, String> suites;
    public Map<String, Object> givens;
    public Map<String, Object> whens;
    public Map<String, Object> thens;
    
    public CalculatorKafeImplementation() {
        // Suites
        suites = new HashMap<>();
        suites.put("Default", "Default test suite for Calculator");
        
        // Givens
        givens = new HashMap<>();
        givens.put("Default", (Function<Void, Calculator>) (v) -> new Calculator());
        
        // Whens
        whens = new HashMap<>();
        whens.put("press", (Function<String, Function<Calculator, Calculator>>) 
            button -> calculator -> calculator.press(button));
        
        whens.put("enter", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.enter());
        
        whens.put("memoryStore", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.memoryStore());
        
        whens.put("memoryRecall", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.memoryRecall());
        
        whens.put("memoryClear", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.memoryClear());
        
        whens.put("memoryAdd", (Function<Void, Function<Calculator, Calculator>>) 
            v -> calculator -> calculator.memoryAdd());
        
        // Thens
        thens = new HashMap<>();
        thens.put("result", (Function<String, Function<Calculator, Boolean>>) 
            expected -> calculator -> {
                String actual = calculator.getDisplay();
                return actual.equals(expected);
            });
    }
}
