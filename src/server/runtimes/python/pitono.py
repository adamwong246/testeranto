#!/usr/bin/env python3

import sys
import json
import os
import ast
from typing import Dict, List, Set, Any
import hashlib
import asyncio

import time

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
    """Generate a bundle containing the combined hash and list of input files."""
    print(f"=== Starting bundle generation for: {entry_point}")
    print(f"=== Output directory: {output_dir}")
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    print(f"=== Output directory exists: {os.path.exists(output_dir)}")
    
    # Generate entry name
    entry_name = os.path.basename(entry_point)
    if entry_name.endswith('.py'):
        entry_name = entry_name[:-3]
    print(f"=== Entry name: {entry_name}")
    
    # Always create a text file with dummy content to prove it works
    text_filename = f"{entry_name}.txt"
    text_path = os.path.join(output_dir, text_filename)
    print(f"=== Text file path: {text_path}")
    
    # Write dummy content to text file
    dummy_content = f"""This is a dummy text file to prove text file generation works.
Entry point: {entry_point}
Timestamp: {hashlib.md5(str(os.getpid()).encode()).hexdigest()[:8]}
"""
    try:
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(dummy_content)
        print(f"=== SUCCESS: Wrote dummy text file to {text_path}")
        print(f"=== File exists after write: {os.path.exists(text_path)}")
        if os.path.exists(text_path):
            with open(text_path, 'r', encoding='utf-8') as f:
                content = f.read()
            print(f"=== File content preview: {content[:100]}")
    except Exception as e:
        print(f"=== ERROR writing text file: {e}")
    
    # Try to collect dependencies, but if it fails, still create a minimal JSON bundle
    try:
        print(f"=== Attempting to collect dependencies for {entry_point}")
        # Collect all dependencies
        all_deps = collect_dependencies(entry_point)
        sorted_deps = sorted(all_deps)
        print(f"=== Found {len(sorted_deps)} dependencies")
        
        # Calculate combined hash
        combined_hash = hashlib.md5()
        for dep in sorted_deps:
            try:
                with open(dep, 'rb') as f:
                    content = f.read()
                combined_hash.update(content)
                combined_hash.update(dep.encode('utf-8'))
            except Exception as e:
                print(f"Warning: Could not read {dep} for hashing: {e}")
                combined_hash.update(dep.encode('utf-8'))
        
        combined_hash_hex = combined_hash.hexdigest()
        print(f"=== Combined hash: {combined_hash_hex}")
        
        # Update text file with actual content
        actual_text_lines = []
        actual_text_lines.append(f"Combined signature: {combined_hash_hex}")
        actual_text_lines.append("")
        actual_text_lines.append("Input files:")
        for i, dep in enumerate(sorted_deps, 1):
            actual_text_lines.append(f"{i}. {dep}")
        
        actual_text_content = '\n'.join(actual_text_lines)
        try:
            with open(text_path, 'w', encoding='utf-8') as f:
                f.write(actual_text_content)
            print(f"=== Updated text file with actual content: {text_path}")
        except Exception as e:
            print(f"=== ERROR updating text file: {e}")
        
        # Create JSON bundle
        output_filename_json = f"{entry_name}.bundle.json"
        output_path_json = os.path.join(output_dir, output_filename_json)
        print(f"=== JSON bundle path: {output_path_json}")
        
        bundle_content = {
            'combined_hash': combined_hash_hex,
            'input_files': sorted_deps,
            'entry_point': entry_point
        }
        
        with open(output_path_json, 'w', encoding='utf-8') as f:
            json.dump(bundle_content, f, indent=2)
        
        print(f"=== Generated JSON bundle: {output_path_json}")
        return output_path_json
        
    except Exception as e:
        print(f"=== Error during bundle generation: {e}")
        print("=== Creating minimal JSON bundle with error information")
        
        # Create a minimal JSON bundle
        output_filename_json = f"{entry_name}.bundle.json"
        output_path_json = os.path.join(output_dir, output_filename_json)
        
        bundle_content = {
            'combined_hash': 'error',
            'input_files': [],
            'entry_point': entry_point,
            'error': str(e)
        }
        
        with open(output_path_json, 'w', encoding='utf-8') as f:
            json.dump(bundle_content, f, indent=2)
        
        print(f"=== Generated minimal JSON bundle due to error: {output_path_json}")
        return output_path_json

def generate_metafile(entry_points: List[str]) -> Dict[str, Any]:
    """Generate a metafile similar to esbuild's structure."""
    inputs: Dict[str, Any] = {}
    outputs: Dict[str, Any] = {}
    
    # Bundle directory
    bundles_dir = os.environ.get('BUNDLES_DIR', '/workspace/testeranto/bundles/allTests/python')
    
    for entry_point in entry_points:
        print(f"Processing entry point: {entry_point}")
        
        # Generate the bundle (which always creates a text file)
        bundle_path = bundle_python_files(entry_point, bundles_dir)
        
        # Generate output key
        entry_name = os.path.basename(entry_point)
        if entry_name.endswith('.py'):
            entry_name = entry_name[:-3]
        output_key = f'python/{entry_name}.json'
        
        # Generate text file path
        text_filename = f"{entry_name}.txt"
        text_path = os.path.join(bundles_dir, text_filename)
        
        # Check if entry point exists to collect dependencies
        if os.path.exists(entry_point):
            # Collect all dependencies
            all_deps = collect_dependencies(entry_point)
            
            # Add to inputs
            for dep in all_deps:
                if dep not in inputs:
                    try:
                        bytes_size = os.path.getsize(dep)
                    except OSError:
                        bytes_size = 0
                    
                    # Calculate MD5 hash for the file content
                    try:
                        with open(dep, 'rb') as f:
                            content = f.read()
                        md5_hash = hashlib.md5(content).hexdigest()
                    except Exception:
                        md5_hash = ''
                    
                    imports = parse_python_imports(dep)
                    inputs[dep] = {
                        'bytes': bytes_size,
                        'imports': imports,
                        'hash': md5_hash
                    }
            
            # Calculate input bytes and collect hashes
            input_bytes: Dict[str, Dict[str, Any]] = {}
            total_input_bytes = 0
            for dep in all_deps:
                try:
                    bytes_size = os.path.getsize(dep)
                except OSError:
                    bytes_size = 0
                
                # Get the MD5 hash for this input
                md5_hash = ''
                if dep in inputs:
                    md5_hash = inputs[dep].get('hash', '')
                
                input_bytes[dep] = {
                    'bytesInOutput': bytes_size,
                    'hash': md5_hash
                }
                total_input_bytes += bytes_size
            
            # Generate a signature for this output based on input hashes
            sorted_deps = sorted(all_deps)
            signature_content = ''
            for dep in sorted_deps:
                if dep in inputs:
                    signature_content += inputs[dep].get('hash', '')
            if signature_content:
                signature = hashlib.md5(signature_content.encode()).hexdigest()
            else:
                signature = ''
        else:
            print(f"Warning: Entry point {entry_point} does not exist")
            all_deps = []
            input_bytes = {}
            total_input_bytes = 0
            signature = ''
            sorted_deps = []
        
        # Add bundle size (size of the generated JSON file)
        try:
            bundle_size = os.path.getsize(bundle_path)
        except OSError:
            bundle_size = 0
        
        # Read the bundle content to get the combined hash
        try:
            with open(bundle_path, 'r', encoding='utf-8') as f:
                bundle_data = json.load(f)
            combined_hash = bundle_data.get('combined_hash', '')
        except Exception:
            combined_hash = ''
        
        outputs[output_key] = {
            'imports': [],
            'exports': [],
            'entryPoint': entry_point,
            'inputs': input_bytes,
            'bytes': total_input_bytes,
            'signature': signature,
            'bundlePath': bundle_path,
            'bundleSize': bundle_size,
            'combinedHash': combined_hash,
            'inputFiles': sorted_deps,
            'textFilePath': text_path
        }
        print(f"Added output for {output_key}")
    
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
    # if len(sys.argv) > 1:
    #     config_path = sys.argv[1]
    # else:
    #     # Try common locations
    #     possible_paths = [
    #         'testeranto/allTests.json'
    #     ]
    #     config_path = None
    #     for path in possible_paths:
    #         if os.path.exists(path):
    #             config_path = path
    #             break
    #     if not config_path:
    #         print("Error: allTests.json not found")
    #         sys.exit(1)

    config_path = "testeranto/runtimes/python/python.py"
    
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
    
    # Print summary
    num_inputs = len(metafile['metafile']['inputs'])
    num_outputs = len(metafile['metafile']['outputs'])
    print(f"Metafile contains {num_inputs} input files and {num_outputs} output bundles")
    
    # List all text files in bundles directory
    print(f"\n=== Checking for generated text files in {bundles_dir} ===")
    if os.path.exists(bundles_dir):
        text_files = [f for f in os.listdir(bundles_dir) if f.endswith('.txt')]
        print(f"Found {len(text_files)} text files:")
        for tf in text_files:
            tf_path = os.path.join(bundles_dir, tf)
            print(f"  - {tf_path}")
            if os.path.exists(tf_path):
                try:
                    with open(tf_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    print(f"    Content preview: {content[:200]}")
                except Exception as e:
                    print(f"    Error reading file: {e}")
    else:
        print(f"Bundles directory does not exist: {bundles_dir}")    

def compute_files_hash(files: List[str]) -> str:
    """Compute a hash from file paths and contents, consistent with Node/Web runtimes."""
    hash_obj = hashlib.md5()
    
    for file_path in files:
        # Add file path to hash
        hash_obj.update(file_path.encode('utf-8'))
        
        # Add file stats to hash (mtime and size)
        try:
            # Use absolute path
            abs_path = file_path
            if not os.path.isabs(file_path):
                abs_path = os.path.join('/workspace', file_path)
            
            if os.path.exists(abs_path):
                stat = os.stat(abs_path)
                # Use mtime in milliseconds as a string (like Node's mtimeMs)
                mtime_ms = int(stat.st_mtime * 1000)
                hash_obj.update(str(mtime_ms).encode('utf-8'))
                hash_obj.update(str(stat.st_size).encode('utf-8'))
            else:
                hash_obj.update(b'missing')
        except Exception as e:
            print(f"[Python Builder] Warning: Could not stat file {file_path}: {e}")
            hash_obj.update(b'error')
    
    return hash_obj.hexdigest()

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
    
    # Get test name from environment
    test_name = os.environ.get('TEST_NAME', 'allTests')
    
    # Collect all input files
    all_input_files = []
    for entry_point in entry_points:
        # Make sure entry point exists
        if os.path.exists(entry_point):
            try:
                # Collect dependencies for each entry point
                deps = collect_dependencies(entry_point)
                all_input_files.extend(deps)
            except Exception as e:
                print(f"[Python Builder] Warning: Could not collect dependencies for {entry_point}: {e}")
                # At least include the entry point itself
                all_input_files.append(entry_point)
        else:
            print(f"[Python Builder] Warning: Entry point {entry_point} does not exist")
            # Still include it in the list
            all_input_files.append(entry_point)
    
    # Remove duplicates and make paths relative to workspace
    unique_files = []
    seen = set()
    for file_path in all_input_files:
        # Make path relative to /workspace if it's absolute
        if os.path.isabs(file_path):
            try:
                rel_path = os.path.relpath(file_path, '/workspace')
                if rel_path not in seen:
                    seen.add(rel_path)
                    unique_files.append(rel_path)
            except ValueError:
                # If file_path is not under /workspace, use as is
                if file_path not in seen:
                    seen.add(file_path)
                    unique_files.append(file_path)
        else:
            if file_path not in seen:
                seen.add(file_path)
                unique_files.append(file_path)
    
    all_input_files = unique_files
    
    # Compute hash
    hash_value = compute_files_hash(all_input_files)
    print(f"[Python Builder] Computed hash: {hash_value}")
    print(f"[Python Builder] Found {len(all_input_files)} input files")
    
    # Send sourceFilesUpdated message for each test
    for entry_point in entry_points:
        # Use the entry point as the test name
        test_name_for_msg = entry_point
        print(f"[Python Builder] Sending sourceFilesUpdated for test: {test_name_for_msg}")
        try:
            asyncio.run(send_source_files_updated(test_name_for_msg, hash_value, all_input_files, "python"))
        except Exception as e:
            print(f"[Python Builder] Failed to send sourceFilesUpdated for {test_name_for_msg}: {e}")
            # Don't fail the build, but log the error
    
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
    
    # Print summary
    num_inputs = len(metafile['metafile']['inputs'])
    num_outputs = len(metafile['metafile']['outputs'])
    print(f"Metafile contains {num_inputs} input files and {num_outputs} output bundles")
    
    # List all text files in bundles directory
    print(f"\n=== Checking for generated text files in {bundles_dir} ===")
    if os.path.exists(bundles_dir):
        text_files = [f for f in os.listdir(bundles_dir) if f.endswith('.txt')]
        print(f"Found {len(text_files)} text files:")
        for tf in text_files:
            tf_path = os.path.join(bundles_dir, tf)
            print(f"  - {tf_path}")
            if os.path.exists(tf_path):
                try:
                    with open(tf_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    print(f"    Content preview: {content[:200]}")
                except Exception as e:
                    print(f"    Error reading file: {e}")
    else:
        print(f"Bundles directory does not exist: {bundles_dir}")

if __name__ == "__main__":
    main()
