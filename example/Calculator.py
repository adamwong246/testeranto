class Calculator:
    """A simple calculator class for demonstration purposes."""
    
    def __init__(self):
        self.display = ""
        self.values = {}
        self.id = id(self)  # Add a unique ID to track instances

    def press(self, button: str):
        """Press a button on the calculator."""
        print(f"[CALCULATOR {self.id}] Pressing: {button}, current display: '{self.display}'")
        
        # Handle special buttons first
        if button == "C":
            return self.clear()
        if button == "MS":
            return self.memory_store()
        if button == "MR":
            return self.memory_recall()
        if button == "MC":
            return self.memory_clear()
        if button == "M+":
            return self.memory_add()
        
        # For regular buttons, append to display
        self.display = self.display + button
        print(f"[CALCULATOR {self.id}] New display is: '{self.display}'")
        return self

    def enter(self):
        """Evaluate the expression on the display."""
        try:
            # Simple expression evaluation using eval
            # Note: Using eval is not recommended for production code
            # This is just for testing purposes
            # pylint: disable=eval-used
            result = eval(self.display)
            self.display = str(result)
        except Exception as error:
            # We'll ignore the specific error for simplicity
            # pylint: disable=unused-variable
            self.display = "Error"
        return self

    def memory_store(self):
        """Store the current display value in memory."""
        try:
            value = float(self.display) if self.display else 0
            self.set_value("memory", value)
            self.clear()
        except ValueError:
            pass
        return self

    def memory_recall(self):
        """Recall the value from memory to the display."""
        memory_value = self.get_value("memory") or 0
        self.display = str(memory_value)
        return self

    def memory_clear(self):
        """Clear the memory value."""
        self.set_value("memory", 0)
        return self

    def memory_add(self):
        """Add the current display value to memory."""
        try:
            current_value = float(self.display) if self.display else 0
            memory_value = self.get_value("memory") or 0
            self.set_value("memory", memory_value + current_value)
            self.clear()
        except ValueError:
            pass
        return self

    def get_display(self):
        """Get the current display value."""
        print(f"[CALCULATOR {self.id}] getDisplay: '{self.display}'")
        return self.display

    def clear(self):
        """Clear the display."""
        self.display = ""
        return self

    # Keep these methods for compatibility
    def add(self, a, b):
        """Add two numbers."""
        return a + b

    def subtract(self, a, b):
        """Subtract b from a."""
        return a - b

    def multiply(self, a, b):
        """Multiply two numbers."""
        return a * b

    def divide(self, a, b):
        """Divide a by b."""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

    def set_value(self, identifier, value):
        """Set a value in the calculator's storage."""
        self.values[identifier] = value

    def get_value(self, identifier):
        """Get a value from the calculator's storage."""
        return self.values.get(identifier, None)
