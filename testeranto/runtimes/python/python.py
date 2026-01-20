#!/usr/bin/env python3
import json
import sys

def main():
    config = {
        "python": {
            "tests": {
                "example/Calculator.test.py": {
                    "path": "example/Calculator.test.py",
                    "ports": 0
                }
            }
        }
    }
    json.dump(config, sys.stdout, indent=2)

if __name__ == "__main__":
    main()
