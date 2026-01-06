#!/usr/bin/env python3
"""
Pitono runtime for Python tests.
This file is executed by the Python Docker container.
It reads allTests.json to generate a Python metafile similar to esbuild's metafile.
"""

import sys
import json
import os
import ast
from typing import Dict, List, Set, Any
import hashlib

def resolve_python_import(import_path: str, current_file: str) -> str | None:
    """Resolve a Python import to a file path."""
    # Handle relative imports
    if import_path.startswith('.'):
        current_dir = os.path.dirname(current_file)
        # Count dots
        dot_count = 0
        remaining = import_path
        while remaining.startswith('.'):
            dot_count += 1
            remaining = remaining[1:]
        
        # Remove leading slash
        if remaining.startswith('/'):
            remaining = remaining[1:]
        
        # Go up appropriate number of directories
        base_dir = current_dir
        for _ in range(1, dot_count):
            base_dir = os.path.dirname(base_dir)
        
        # Handle case with no remaining path
        if not remaining:
            init_path = os.path.join(base_dir, '__init__.py')
            if os.path.exists(init_path):
                return init_path
            return None
        
        # Resolve full path
        resolved = os.path.join(base_dir, remaining)
        
        # Try different extensions
        for ext in ['.py', '/__init__.py']:
            potential = resolved + ext
            if os.path.exists(potential):
                return potential
        
        # Check if it's a directory with __init__.py
        if os.path.exists(resolved) and os.path.isdir(resolved):
            init_path = os.path.join(resolved, '__init__.py')
            if os.path.exists(init_path):
                return init_path
        return None
    
    # Handle absolute imports
    # Look in various directories
    dirs = [
        os.path.dirname(current_file),
        os.getcwd(),
    ] + os.environ.get('PYTHONPATH', '').split(os.pathsep)
    
    for dir_path in dirs:
        if not dir_path:
            continue
        potential_paths = [
            os.path.join(dir_path, import_path + '.py'),
            os.path.join(dir_path, import_path, '__init__.py'),
            os.path.join(dir_path, import_path.replace('.', '/') + '.py'),
            os.path.join(dir_path, import_path.replace('.', '/'), '__init__.py'),
        ]
        for potential in potential_paths:
            if os.path.exists(potential):
                return potential
    return None

def parse_python_imports(file_path: str) -> List[Dict[str, Any]]:
    """Parse import statements from a Python file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Warning: Could not read {file_path}: {e}")
        return []
    
    try:
        tree = ast.parse(content)
    except SyntaxError as e:
        print(f"Warning: Syntax error in {file_path}: {e}")
        return []
    
    imports = []
    
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                import_path = alias.name
                resolved = resolve_python_import(import_path, file_path)
                imports.append({
                    'path': import_path,
                    'kind': 'import-statement',
                    'external': resolved is None,
                })
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                import_path = node.module
                resolved = resolve_python_import(import_path, file_path)
                imports.append({
                    'path': import_path,
                    'kind': 'import-statement',
                    'external': resolved is None,
                })
    return imports

def collect_dependencies(file_path: str, visited: Set[str] = None) -> List[str]:
    """Collect all dependencies of a Python file recursively."""
    if visited is None:
        visited = set()
    
    if file_path in visited:
        return []
    visited.add(file_path)
    
    dependencies = [file_path]
    imports = parse_python_imports(file_path)
    
    for imp in imports:
        if not imp.get('external') and imp['path']:
            resolved = resolve_python_import(imp['path'], file_path)
            if resolved and os.path.exists(resolved):
                dependencies.extend(collect_dependencies(resolved, visited))
    
    # Remove duplicates
    seen = set()
    unique = []
    for dep in dependencies:
        if dep not in seen:
            seen.add(dep)
            unique.append(dep)
    return unique

def topological_sort(files: List[str]) -> List[str]:
    """Sort files based on import dependencies."""
    # Build dependency graph
    graph = {file: set() for file in files}
    for file in files:
        imports = parse_python_imports(file)
        for imp in imports:
            if not imp.get('external') and imp['path']:
                resolved = resolve_python_import(imp['path'], file)
                if resolved and resolved in files:
                    graph[file].add(resolved)
    
    # Kahn's algorithm
    in_degree = {node: 0 for node in graph}
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1
    
    # Queue of nodes with no incoming edges
    queue = [node for node in graph if in_degree[node] == 0]
    sorted_list = []
    
    while queue:
        node = queue.pop(0)
        sorted_list.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycles
    if len(sorted_list) != len(files):
        print("Warning: Circular dependencies detected, using original order")
        return files
    
    return sorted_list

def strip_imports(content: str) -> str:
    """Remove import statements from Python code."""
    lines = content.split('\n')
    result_lines = []
    in_multiline_string = False
    multiline_delimiter = None
    
    for line in lines:
        # Handle multiline strings
        stripped_line = line.strip()
        if not in_multiline_string:
            # Check for start of multiline string
            if stripped_line.startswith('"""') or stripped_line.startswith("'''"):
                # Check if it's a single line or multiline
                if stripped_line.count('"""') == 1 or stripped_line.count("'''") == 1:
                    in_multiline_string = True
                    multiline_delimiter = stripped_line[:3]
                result_lines.append(line)
                continue
            # Check for import statements
            elif stripped_line.startswith('import ') or stripped_line.startswith('from '):
                # Skip this line
                continue
            else:
                result_lines.append(line)
        else:
            # Inside a multiline string
            result_lines.append(line)
            # Check for end of multiline string
            if multiline_delimiter in stripped_line:
                # Count occurrences to handle cases where delimiter appears in the string
                if stripped_line.count(multiline_delimiter) % 2 == 1:
                    in_multiline_string = False
                    multiline_delimiter = None
    
    return '\n'.join(result_lines)

def bundle_python_files(entry_point: str, output_dir: str) -> str:
    """Bundle all dependencies of a Python file into a single file."""
    # Collect all dependencies
    all_deps = collect_dependencies(entry_point)
    
    # Sort them topologically
    sorted_deps = topological_sort(all_deps)
    
    # Read and process each file
    bundled_lines = []
    seen_contents = set()
    
    for dep in sorted_deps:
        try:
            with open(dep, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Warning: Could not read {dep}: {e}")
            continue
        
        # Generate a hash to avoid duplicates
        content_hash = hashlib.md5(content.encode()).hexdigest()
        if content_hash in seen_contents:
            continue
        seen_contents.add(content_hash)
        
        # Strip import statements
        stripped_content = strip_imports(content)
        if stripped_content.strip():
            bundled_lines.append(f"# File: {dep}")
            bundled_lines.append(stripped_content)
            bundled_lines.append("")  # Add a blank line between files
    
    # Combine all lines
    bundled_content = '\n'.join(bundled_lines)
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate output filename
    entry_name = os.path.basename(entry_point)
    if entry_name.endswith('.py'):
        entry_name = entry_name[:-3]
    output_filename = f"{entry_name}.bundled.py"
    output_path = os.path.join(output_dir, output_filename)
    
    # Write bundled file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(bundled_content)
    
    return output_path

def generate_metafile(entry_points: List[str]) -> Dict[str, Any]:
    """Generate a metafile similar to esbuild's structure."""
    inputs: Dict[str, Any] = {}
    outputs: Dict[str, Any] = {}
    
    # Generate a signature
    signature = hashlib.md5(str(os.getpid()).encode() + str(os.times()).encode()).hexdigest()[:8]
    
    # Bundle directory
    bundles_dir = os.environ.get('BUNDLES_DIR', '/workspace/testeranto/bundles/allTests/python')
    
    for entry_point in entry_points:
        if not os.path.exists(entry_point):
            print(f"Warning: Entry point {entry_point} does not exist")
            continue
        
        # Collect all dependencies
        all_deps = collect_dependencies(entry_point)
        
        # Add to inputs
        for dep in all_deps:
            if dep not in inputs:
                try:
                    bytes_size = os.path.getsize(dep)
                except OSError:
                    bytes_size = 0
                imports = parse_python_imports(dep)
                inputs[dep] = {
                    'bytes': bytes_size,
                    'imports': imports
                }
        
        # Generate the bundle
        bundle_path = bundle_python_files(entry_point, bundles_dir)
        
        # Generate output key
        entry_name = os.path.basename(entry_point)
        if entry_name.endswith('.py'):
            entry_name = entry_name[:-3]
        output_key = f'python/{entry_name}.py'
        
        # Calculate input bytes
        input_bytes: Dict[str, Dict[str, int]] = {}
        total_bytes = 0
        for dep in all_deps:
            try:
                bytes_size = os.path.getsize(dep)
            except OSError:
                bytes_size = 0
            input_bytes[dep] = {'bytesInOutput': bytes_size}
            total_bytes += bytes_size
        
        # Add bundle size
        try:
            bundle_size = os.path.getsize(bundle_path)
        except OSError:
            bundle_size = 0
        
        outputs[output_key] = {
            'imports': [],
            'exports': [],
            'entryPoint': entry_point,
            'inputs': input_bytes,
            'bytes': total_bytes,
            'signature': signature,
            'bundlePath': bundle_path,
            'bundleSize': bundle_size
        }
    
    return {
        'errors': [],
        'warnings': [],
        'metafile': {
            'inputs': inputs,
            'outputs': outputs
        }
    }

# def run_python_test(entry_point):
#     """Execute a Python test and return results."""
#     import subprocess
#     import tempfile
#     import traceback
    
#     # Create a temporary file to capture results
#     with tempfile.NamedTemporaryFile(mode='w+', suffix='.json', delete=False) as tmp:
#         result_file = tmp.name
    
#     # Set environment variable for result file
#     env = os.environ.copy()
#     env['TEST_RESULT_FILE'] = result_file
    
#     # Run the test from the original entry point
#     try:
#         result = subprocess.run(
#             [sys.executable, entry_point],
#             env=env,
#             capture_output=True,
#             text=True,
#             timeout=30  # 30 second timeout
#         )
        
#         # Check if test wrote a result file
#         if os.path.exists(result_file):
#             with open(result_file, 'r') as f:
#                 test_result = json.load(f)
#             os.unlink(result_file)
#         else:
#             # Create a default result structure
#             test_result = {
#                 'passed': result.returncode == 0,
#                 'returncode': result.returncode,
#                 'stdout': result.stdout,
#                 'stderr': result.stderr
#             }
        
#         return test_result
#     except subprocess.TimeoutExpired:
#         return {
#             'passed': False,
#             'error': 'Test timed out after 30 seconds'
#         }
#     except Exception as e:
#         return {
#             'passed': False,
#             'error': str(e),
#             'traceback': traceback.format_exc()
#         }
#     finally:
#         # Clean up result file if it still exists
#         if os.path.exists(result_file):
#             try:
#                 os.unlink(result_file)
#             except:
#                 pass

def main():
    # Determine config path
    # First, check command line argument
    if len(sys.argv) > 1:
        config_path = sys.argv[1]
    else:
        # Try common locations
        possible_paths = [
            'testeranto/allTests.json'
        ]
        config_path = None
        for path in possible_paths:
            if os.path.exists(path):
                config_path = path
                break
        if not config_path:
            print("Error: allTests.json not found")
            sys.exit(1)
    
    print(f"Reading config from {config_path}")
    
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
    except Exception as e:
        print(f"Error loading config: {e}")
        sys.exit(1)
    
    # Get Python test entry points
    python_config = config.get('python', {})
    tests = python_config.get('tests', {})
    entry_points = list(tests.keys())
    
    if not entry_points:
        print("No Python tests found in config")
        # Still generate an empty metafile
        entry_points = []
    
    print(f"Found {len(entry_points)} Python test(s)")
    
    # Generate metafile (which also generates bundles)
    metafile = generate_metafile(entry_points)
    
    # Write metafile
    metafiles_dir = os.environ.get('METAFILES_DIR', '/workspace/testeranto/metafiles/python')
    os.makedirs(metafiles_dir, exist_ok=True)
    
    metafile_path = os.path.join(metafiles_dir, 'allTests.json')
    print(f"Writing metafile to: {metafile_path}")
    with open(metafile_path, 'w') as f:
        json.dump(metafile, f, indent=2)
    print(f"Metafile written successfully")
    
    print(f"Python metafile written to {metafile_path}")
    
    # Print bundle information
    bundles_dir = os.environ.get('BUNDLES_DIR', '/workspace/testeranto/bundles/allTests/python')
    print(f"Python bundles written to {bundles_dir}")
    
    # Run each test from its original entry point
    # test_results = []
    # all_passed = True
    
    # for entry_point in entry_points:
    #     print(f"  Running test: {entry_point}")
        
    #     # Run the test
    #     result = run_python_test(entry_point)
    #     test_results.append({
    #         'test': entry_point,
    #         'result': result
    #     })
        
    #     if not result.get('passed', False):
    #         all_passed = False
    #         print(f"  ❌ Test failed")
    #         if 'error' in result:
    #             print(f"    Error: {result['error']}")
    #         if 'stderr' in result and result['stderr']:
    #             print(f"    Stderr: {result['stderr'][:500]}")
    #     else:
    #         print(f"  ✅ Test passed")
    
    # Print summary
    num_inputs = len(metafile['metafile']['inputs'])
    num_outputs = len(metafile['metafile']['outputs'])
    print(f"Metafile contains {num_inputs} input files and {num_outputs} output bundles")
    
    # Write test results to the correct location for the test runner
    # The path should be: testeranto/reports/allTests/example/Calculator.pitono.test/python
    # We need to extract the test name from the entry points
    # if entry_points:
    #     # Use the first entry point to determine the test name
    #     first_entry = entry_points[0]
    #     # Extract the test name: example/Calculator.pitono.test.py -> example/Calculator.pitono.test
    #     test_name = os.path.splitext(first_entry)[0]
    #     # Remove any leading path components to get just the base name? 
    #     # Actually, we want the relative path from workspace root
    #     # Let's get the relative path from /workspace
    #     workspace_root = '/workspace'
    #     if first_entry.startswith(workspace_root):
    #         rel_path = os.path.relpath(first_entry, workspace_root)
    #         test_name = os.path.splitext(rel_path)[0]
    #     else:
    #         # Try to make it relative to current directory
    #         rel_path = os.path.relpath(first_entry, os.getcwd())
    #         test_name = os.path.splitext(rel_path)[0]
        
    #     # Build the reports directory path
    #     # The path should be: testeranto/reports/allTests/example/Calculator.pitono.test/python
    #     # First, get the absolute path of the entry point
    #     abs_entry = os.path.abspath(first_entry)
    #     # Remove .py extension
    #     base_name = os.path.splitext(abs_entry)[0]
        
    #     # The workspace root is /workspace
    #     workspace_root = '/workspace'
    #     # Make sure base_name is under workspace
    #     if base_name.startswith(workspace_root):
    #         # Get path relative to workspace
    #         rel_path = os.path.relpath(base_name, workspace_root)
    #     else:
    #         # This shouldn't happen in Docker, but handle it
    #         rel_path = base_name
        
    #     # Build the full reports directory path
    #     reports_dir = os.path.join(workspace_root, 'testeranto', 'reports', 'allTests', rel_path, 'python')
    #     os.makedirs(reports_dir, exist_ok=True)
        
    #     # Write tests.json in the format expected by the test runner
    #     tests_path = os.path.join(reports_dir, 'tests.json')
        
    #     # Prepare test data in a format similar to what node produces
    #     # We need to create a structure with name, givens, fails, failed, features, artifacts
    #     # Since we don't have the full BDD structure, we'll create a simplified version
    #     tests_data = {
    #         'name': os.path.basename(base_name),
    #         'givens': [],
    #         'fails': sum(1 for r in test_results if not r['result'].get('passed', False)),
    #         'failed': not all_passed,
    #         'features': [f"Test: {r['test']}" for r in test_results],
    #         'artifacts': []
    #     }
        
    #     with open(tests_path, 'w') as f:
    #         json.dump(tests_data, f, indent=2)
        
    #     print(f"Test results written to {tests_path}")
        
    #     # Also write detailed results for debugging
    #     detailed_path = os.path.join(reports_dir, 'detailed_results.json')
    #     with open(detailed_path, 'w') as f:
    #         json.dump({
    #             'all_passed': all_passed,
    #             'results': test_results,
    #             'summary': {
    #                 'total': len(test_results),
    #                 'passed': sum(1 for r in test_results if r['result'].get('passed', False)),
    #                 'failed': sum(1 for r in test_results if not r['result'].get('passed', False))
    #             }
    #         }, f, indent=2)
    # else:
    #     # Fallback to metafiles directory
    #     results_dir = os.environ.get('METAFILES_DIR', '/workspace/testeranto/metafiles/python')
    #     results_path = os.path.join(results_dir, 'test_results.json')
    #     with open(results_path, 'w') as f:
    #         json.dump({
    #             'all_passed': all_passed,
    #             'results': test_results,
    #             'summary': {
    #                 'total': len(test_results),
    #                 'passed': sum(1 for r in test_results if r['result'].get('passed', False)),
    #                 'failed': sum(1 for r in test_results if not r['result'].get('passed', False))
    #             }
    #         }, f, indent=2)
    #     print(f"Test results written to {results_path}")
        
    #     # Also write tests.json for consistency
    #     tests_path = os.path.join(results_dir, 'tests.json')
    #     tests_data = {
    #         'name': 'PythonTests',
    #         'givens': [],
    #         'fails': sum(1 for r in test_results if not r['result'].get('passed', False)),
    #         'failed': not all_passed,
    #         'features': [f"Test: {r['test']}" for r in test_results],
    #         'artifacts': []
    #     }
    #     with open(tests_path, 'w') as f:
    #         json.dump(tests_data, f, indent=2)
    
    # Exit with appropriate code
    # if not all_passed:
    #     print("Some tests failed")
    #     sys.exit(1)
    # else:
    #     print("All tests passed")
    #     sys.exit(0)

if __name__ == "__main__":
    main()
