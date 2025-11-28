class Calculator:
    def __init__(self):
        self.display = ""
        self.values = {}
        self.id = id(self)  # Add a unique ID to track instances

    def press(self, button: str):
        print(f"[CALCULATOR {self.id}] Pressing: {button}, current display: '{self.display}'")
        
        # Handle special buttons first
        if button == "C":
            return self.clear()
        elif button == "MS":
            return self.memory_store()
        elif button == "MR":
            return self.memory_recall()
        elif button == "MC":
            return self.memory_clear()
        elif button == "M+":
            return self.memory_add()
        
        # For regular buttons, append to display
        self.display = self.display + button
        print(f"[CALCULATOR {self.id}] New display is: '{self.display}'")
        return self

    def enter(self):
        try:
            # Simple expression evaluation using eval
            # Note: Using eval is not recommended for production code
            # This is just for testing purposes
            result = eval(self.display)
            self.display = str(result)
        except Exception as error:
            self.display = "Error"
        return self

    def memory_store(self):
        try:
            value = float(self.display) if self.display else 0
            self.set_value("memory", value)
            self.clear()
        except:
            pass
        return self

    def memory_recall(self):
        memory_value = self.get_value("memory") or 0
        self.display = str(memory_value)
        return self

    def memory_clear(self):
        self.set_value("memory", 0)
        return self

    def memory_add(self):
        try:
            current_value = float(self.display) if self.display else 0
            memory_value = self.get_value("memory") or 0
            self.set_value("memory", memory_value + current_value)
            self.clear()
        except:
            pass
        return self

    def get_display(self):
        print(f"[CALCULATOR {self.id}] getDisplay: '{self.display}'")
        return self.display

    def clear(self):
        self.display = ""
        return self

    # Keep these methods for compatibility
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

    def multiply(self, a, b):
        return a * b

    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

    def set_value(self, identifier, value):
        self.values[identifier] = value

    def get_value(self, identifier):
        return self.values.get(identifier, None)
