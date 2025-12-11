#!/usr/bin/env python3
import subprocess
import os
import sys

def test_aider_cli():
    print("Testing aider CLI...")
    
    # Check if aider is installed
    try:
        result = subprocess.run(["aider", "--version"], 
                              capture_output=True, text=True)
        print(f"Aider version: {result.stdout.strip()}")
    except FileNotFoundError:
        print("ERROR: aider command not found")
        print("Make sure aider is installed in the Docker container")
        return False
    
    # Check OpenAI API key
    if not os.getenv("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY environment variable is not set")
        print("Aider requires an OpenAI API key to work")
        return False
    
    # Create a test file
    test_file = "test_hello.py"
    with open(test_file, "w") as f:
        f.write("# Test file\n")
    
    try:
        # Run aider with a simple command
        print(f"Running aider on {test_file}...")
        cmd = [
            "aider",
            "--yes",
            "--dark-mode",
            "--model", "gpt-4",
            test_file
        ]
        
        # Run with timeout
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Send a simple command
        stdout, stderr = process.communicate(
            input="add a function that returns hello\n",
            timeout=30
        )
        
        print(f"Exit code: {process.returncode}")
        print(f"Stdout:\n{stdout}")
        if stderr:
            print(f"Stderr:\n{stderr}")
        
        # Check if file was modified
        with open(test_file, "r") as f:
            content = f.read()
            print(f"File content after aider:\n{content}")
        
        return process.returncode == 0
        
    except subprocess.TimeoutExpired:
        print("ERROR: aider command timed out after 30 seconds")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False
    finally:
        # Clean up
        if os.path.exists(test_file):
            os.remove(test_file)

if __name__ == "__main__":
    success = test_aider_cli()
    sys.exit(0 if success else 1)
