from typing import Any, Callable, Dict
import os
import sys

# Add the current directory to sys.path to find Calculator
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import Calculator using absolute import
from Calculator import Calculator

class Implementation:
    def __init__(self):
        self.suites = {
            "Default": "Default test suite for Calculator"
        }
        self.givens = {
            "Default": lambda: Calculator()
        }
        self.whens = {
            "press": lambda button: lambda calc: calc.press(button),
            "enter": lambda: lambda calc: calc.enter(),
            "memoryStore": lambda: lambda calc: calc.memory_store(),
            "memoryRecall": lambda: lambda calc: calc.memory_recall(),
            "memoryClear": lambda: lambda calc: calc.memory_clear(),
            "memoryAdd": lambda: lambda calc: calc.memory_add()
        }
        self.thens = {
            "result": lambda expected: lambda calc: self._assert_result(calc, expected)
        }

    def _assert_result(self, calculator, expected):
        actual = calculator.get_display()
        if actual != expected:
            raise AssertionError(f"Expected display '{expected}', got '{actual}'")

# Create an instance
implementation = Implementation()
