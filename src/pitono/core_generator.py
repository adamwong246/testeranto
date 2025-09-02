import json
import os
import sys
from typing import Dict, List, Any
from pathlib import Path

class PitonoCoreGenerator:
    def __init__(self, test_name: str, entry_points: List[str]):
        self.test_name = test_name
        self.entry_points = entry_points
        self.output_dir = Path("testeranto") / "pitono" / test_name
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_core_json(self) -> Dict[str, Any]:
        """Generate a core.json file similar to esbuild's output"""
        return {
            "testName": self.test_name,
            "entryPoints": self.entry_points,
            "outputs": self._generate_outputs(),
            "metafile": {
                "inputs": self._generate_inputs(),
                "outputs": self._generate_metafile_outputs()
            },
            "timestamp": self._get_timestamp(),
            "runtime": "pitono"
        }
    
    def _generate_outputs(self) -> Dict[str, Any]:
        """Generate outputs section similar to esbuild"""
        outputs = {}
        for entry_point in self.entry_points:
            # For pitono, the "output" is the test file itself
            # Use the absolute path to the original file
            absolute_path = os.path.abspath(entry_point)
            outputs[absolute_path] = {
                "imports": [],
                "exports": [],
                "entryPoint": entry_point,
                "inputs": {
                    ep: {
                        "bytes": os.path.getsize(ep) if os.path.exists(ep) else 1024,
                        "imports": []
                    }
                    for ep in self.entry_points
                },
                "bytes": os.path.getsize(entry_point) if os.path.exists(entry_point) else 2048
            }
        return outputs
    
    def _generate_inputs(self) -> Dict[str, Any]:
        """Generate inputs section for metafile"""
        inputs = {}
        for entry_point in self.entry_points:
            # Use absolute paths
            absolute_path = os.path.abspath(entry_point)
            inputs[absolute_path] = {
                "bytes": os.path.getsize(entry_point) if os.path.exists(entry_point) else 1024,
                "imports": []
            }
        return inputs
    
    def _generate_metafile_outputs(self) -> Dict[str, Any]:
        """Generate outputs section for metafile"""
        outputs = {}
        for entry_point in self.entry_points:
            # Use the absolute path to the original file
            absolute_path = os.path.abspath(entry_point)
            outputs[absolute_path] = {
                "bytes": os.path.getsize(entry_point) if os.path.exists(entry_point) else 2048,
                "inputs": {
                    ep: {
                        "bytesInOutput": os.path.getsize(ep) if os.path.exists(ep) else 1024
                    }
                    for ep in self.entry_points
                },
                "exports": [],
                "entryPoint": entry_point
            }
        return outputs
    
    def _get_timestamp(self) -> int:
        """Get current timestamp"""
        import time
        return int(time.time() * 1000)
    
    def write_core_json(self):
        """Write the core.json file to disk"""
        core_data = self.generate_core_json()
        core_file_path = self.output_dir / "core.json"
        
        with open(core_file_path, 'w') as f:
            json.dump(core_data, f, indent=2)
        
        print(f"Pitono core.json written to: {core_file_path}")
        return core_file_path

def main():
    if len(sys.argv) < 3:
        print("Usage: pitono-core-generator <test_name> <entry_point1> [entry_point2 ...]")
        sys.exit(1)
    
    test_name = sys.argv[1]
    # Convert entry points to absolute paths
    entry_points = [os.path.abspath(ep) for ep in sys.argv[2:]]
    
    generator = PitonoCoreGenerator(test_name, entry_points)
    generator.write_core_json()

if __name__ == "__main__":
    main()
