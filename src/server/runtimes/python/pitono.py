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

def generate_metafile(entry_points: List[str]) -> Dict[str, Any]:
    """Generate a metafile similar to esbuild's structure."""
    inputs: Dict[str, Any] = {}
    outputs: Dict[str, Any] = {}
    
    # Generate a signature
    signature = hashlib.md5(str(os.getpid()).encode() + str(os.times()).encode()).hexdigest()[:8]
    
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
        
        outputs[output_key] = {
            'imports': [],
            'exports': [],
            'entryPoint': entry_point,
            'inputs': input_bytes,
            'bytes': total_bytes,
            'signature': signature
        }
    
    return {
        'errors': [],
        'warnings': [],
        'metafile': {
            'inputs': inputs,
            'outputs': outputs
        }
    }

def main():
    # Determine config path
    # First, check command line argument
    if len(sys.argv) > 1:
        config_path = sys.argv[1]
    else:
        # Try common locations
        possible_paths = [
            # '/workspace/testeranto/bundles/allTests/allTests.json',
            # '/workspace/allTests.json',
            # 'allTests.json',
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
    
    # Generate metafile
    metafile = generate_metafile(entry_points)
    
    # Write metafile
    metafiles_dir = os.environ.get('METAFILES_DIR', '/workspace/testeranto/metafiles/python')
    os.makedirs(metafiles_dir, exist_ok=True)
    
    metafile_path = os.path.join(metafiles_dir, 'python.metafile.json')
    with open(metafile_path, 'w') as f:
        json.dump(metafile, f, indent=2)
    
    print(f"Python metafile written to {metafile_path}")
    
    # Print summary
    num_inputs = len(metafile['metafile']['inputs'])
    num_outputs = len(metafile['metafile']['outputs'])
    print(f"Metafile contains {num_inputs} input files and {num_outputs} output bundles")

if __name__ == "__main__":
    main()
