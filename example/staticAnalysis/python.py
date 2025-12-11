#!/usr/bin/env python3
"""
Python static analysis
This is a runtime-native check file that will be executed by the analysis service
It receives the metafile path as the first argument
"""

import json
import subprocess
import sys
import os
from pathlib import Path

def run_static_analysis(metafile_path):
    print("Python static analysis starting...")
    
    # Read metafile
    with open(metafile_path, 'r') as f:
        metafile = json.load(f)
    
    files = list(metafile.get('inputs', {}).keys())
    python_files = [f for f in files if f.endswith('.py')]
    
    print(f"Found {len(python_files)} Python files in metafile")
    
    results = {
        'pylint': [],
        'mypy': [],
        'flake8': [],
        'summary': {
            'total_files': len(python_files),
            'analyzed_files': 0,
            'errors': 0,
            'warnings': 0
        }
    }
    
    if not python_files:
        print("No Python files found for analysis")
        return results
    
    # Run pylint
    try:
        import pylint.lint
        from pylint.reporters.json_reporter import JSONReporter
        
        print("Running pylint...")
        pylint_args = python_files + ['--output-format=json', '--exit-zero']
        
        # Capture pylint output
        from io import StringIO
        output = StringIO()
        reporter = JSONReporter(output)
        
        # Run pylint
        pylint.lint.Run(pylint_args, reporter=reporter, exit=False)
        
        pylint_results = json.loads(output.getvalue())
        results['pylint'] = pylint_results
        
        for result in pylint_results:
            if result['type'] == 'error':
                results['summary']['errors'] += 1
            elif result['type'] == 'warning':
                results['summary']['warnings'] += 1
        
        results['summary']['analyzed_files'] += len(python_files)
        
    except ImportError:
        print("pylint not available, skipping...")
    except Exception as e:
        print(f"pylint analysis failed: {e}")
    
    # Run mypy
    try:
        import mypy.api
        
        print("Running mypy...")
        mypy_result = mypy.api.run(python_files)
        
        results['mypy'] = {
            'stdout': mypy_result[0],
            'stderr': mypy_result[1],
            'exit_status': mypy_result[2]
        }
        
        # Parse mypy output for error/warning counts
        if mypy_result[0]:
            error_lines = [line for line in mypy_result[0].split('\n') if 'error:' in line]
            results['summary']['errors'] += len(error_lines)
        
    except ImportError:
        print("mypy not available, skipping...")
    except Exception as e:
        print(f"mypy analysis failed: {e}")
    
    # Run flake8
    try:
        import flake8.main.application
        
        print("Running flake8...")
        app = flake8.main.application.Application()
        app.run(python_files)
        
        # Get the results
        guide = app.guide
        results['flake8'] = {
            'total_errors': guide.total_errors,
            'files_checked': len(python_files)
        }
        
        results['summary']['errors'] += guide.total_errors
        
    except ImportError:
        print("flake8 not available, skipping...")
    except Exception as e:
        print(f"flake8 analysis failed: {e}")
    
    print(f"Python static analysis completed")
    print(f"Summary: {results['summary']['errors']} errors, {results['summary']['warnings']} warnings")
    
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 python.py <metafile-path>")
        sys.exit(1)
    
    metafile_path = sys.argv[1]
    results = run_static_analysis(metafile_path)
    
    print(json.dumps(results, indent=2))
    
    # Exit with non-zero code if there are errors
    if results['summary']['errors'] > 0:
        sys.exit(1)
