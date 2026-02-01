# This file is where your project configures the runtime that testeranto uses for python
#!/usr/bin/env python3
import json
import sys

def main():
    return {
        "python": {
            "tests": {
                "example/Calculator.pitono.test.py": {
                    "path": "example/Calculator.pitono.test.py",
                    "ports": 0
                }
            }
        }
    }

if __name__ == "__main__":
    main()
