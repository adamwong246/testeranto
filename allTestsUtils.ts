import { IDockerSteps } from "./src/Types";

export const createLangConfig = (
  testFile: string,
  check: ((x: any) => string)[],
  options?: {
    plugins?: any[];
    loaders?: Record<string, string>;
    externals?: string[];
    testBlocks?: [IDockerSteps, string][][];
    prodBlocks?: [IDockerSteps, string][][];
    check: string;
  }
) => {
  return {
    plugins: options?.plugins || [],
    loaders: options?.loaders || {},
    tests: { [testFile]: { ports: 0 } },
    externals: options?.externals || [],
    test: options?.testBlocks,
    prod: options?.prodBlocks,
    check: check,
    // build: options?.build,
    // processPool: options?.processPool,
    // chrome: options?.chrome,
    // monitoring: options?.monitoring || {}, // Include monitoring config
  };
};

// // Static analysis that uses a metafile to analyze only relevant files
// // The metafile path is expected to be in $METAFILE_PATH environment variable
// export const NODE_METAFILE_ANALYSIS: [IDockerSteps, string][] = [
//   ...NODE_BASE_STEPS,
//   [
//     "RUN",
//     "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx eslint ' + files.join(' ')).status); } else { console.log('No files to lint'); } \"",
//   ],
//   [
//     "RUN",
//     "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx tsc --noEmit ' + files.join(' ')).status); } else { console.log('No files to type-check'); } \"",
//   ],
// ];

// export const WEB_METAFILE_ANALYSIS: [IDockerSteps, string][] = [
//   ...WEB_BASE_STEPS,
//   [
//     "RUN",
//     "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx eslint ' + files.join(' ')).status); } else { console.log('No files to lint'); } \"",
//   ],
//   [
//     "RUN",
//     "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx tsc --noEmit ' + files.join(' ')).status); } else { console.log('No files to type-check'); } \"",
//   ],
//   [
//     "RUN",
//     "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx stylelint ' + files.filter(f => f.endsWith('.css') || f.endsWith('.scss')).join(' ')).status); } else { console.log('No style files to check'); } \"",
//   ],
// ];

// export const PYTHON_METAFILE_ANALYSIS: [IDockerSteps, string][] = [
//   ...PYTHON_BASE_STEPS,
//   // Create a script to run static analysis based on metafile
//   [
//     "RUN",
//     `cat > /tmp/run_python_analysis.py << 'EOF'
// import json
// import os
// import subprocess
// import sys

// def run_analysis():
//     metafile_path = os.environ.get('METAFILE_PATH')
//     if not metafile_path or not os.path.exists(metafile_path):
//         print("No metafile found at METAFILE_PATH")
//         return 0

//     with open(metafile_path, 'r') as f:
//         data = json.load(f)

//     # Get input files from metafile
//     inputs = data.get('inputs', {})
//     files = list(inputs.keys()) if isinstance(inputs, dict) else []

//     if not files:
//         print("No files to analyze")
//         return 0

//     # Filter for Python files
//     python_files = [f for f in files if f.endswith('.py')]
//     if not python_files:
//         print("No Python files to analyze")
//         return 0

//     exit_code = 0

//     # Run flake8
//     print("Running flake8...")
//     result = subprocess.run(['flake8'] + python_files, capture_output=True, text=True)
//     if result.returncode != 0:
//         print(result.stdout)
//         print(result.stderr)
//         exit_code = result.returncode

//     # Run pylint
//     print("Running pylint...")
//     result = subprocess.run(['pylint'] + python_files, capture_output=True, text=True)
//     if result.returncode != 0:
//         print(result.stdout)
//         print(result.stderr)
//         exit_code = result.returncode

//     # Run mypy
//     print("Running mypy...")
//     result = subprocess.run(['mypy'] + python_files, capture_output=True, text=True)
//     if result.returncode != 0:
//         print(result.stdout)
//         print(result.stderr)
//         exit_code = result.returncode

//     return exit_code

// if __name__ == '__main__':
//     sys.exit(run_analysis())
// EOF`,
//   ],
//   ["RUN", "python3 /tmp/run_python_analysis.py"],
// ];

// export const GOLANG_METAFILE_ANALYSIS: [IDockerSteps, string][] = [
//   ...GOLANG_BASE_STEPS,
//   [
//     "RUN",
//     'sh -c \'if [ -f "$METAFILE_PATH" ]; then go vet $(jq -r ".inputs | keys[]" "$METAFILE_PATH" 2>/dev/null | grep "\\.go$" | xargs echo); else echo "No metafile for go vet"; fi\'',
//   ],
//   [
//     "RUN",
//     'sh -c \'if [ -f "$METAFILE_PATH" ]; then staticcheck $(jq -r ".inputs | keys[]" "$METAFILE_PATH" 2>/dev/null | grep "\\.go$" | xargs echo); else echo "No metafile for staticcheck"; fi\'',
//   ],
// ];

// Test execution steps with static analysis pre-test
// export const NODE_TEST_STEPS: [IDockerSteps, string][] = [
//   ...NODE_BASE_STEPS,
//   ...NODE_METAFILE_ANALYSIS.slice(NODE_BASE_STEPS.length),
//   ["RUN", "npm test"],
// ];

// export const WEB_TEST_STEPS: [IDockerSteps, string][] = [
//   ...WEB_BASE_STEPS,
//   ["RUN", "npm test"],
// ];

// export const PYTHON_TEST_STEPS: [IDockerSteps, string][] = [
//   ...PYTHON_BASE_STEPS,
//   [
//     "RUN",
//     "python3 -c \"import sys; import subprocess; import pkg_resources; required = {'pylint', 'mypy', 'flake8', 'websockets'}; installed = {pkg.key for pkg in pkg_resources.working_set}; missing = required - installed; print('Missing packages:', missing) if missing else print('All required packages installed')\"",
//   ],
//   ...PYTHON_METAFILE_ANALYSIS.slice(PYTHON_BASE_STEPS.length),
//   ["RUN", "pytest"],
// ];

// export const GOLANG_TEST_STEPS: [IDockerSteps, string][] = [
//   ...GOLANG_BASE_STEPS,
//   ["RUN", "go test ./..."],
// ];

// export const BUILD_PROD_STEP: [IDockerSteps, string] = [
//   "RUN",
//   "BUILD YOU PRODUCTION BUNDLE",
// ];
// export const BUILD_THING_STEP: [IDockerSteps, string] = [
//   "RUN",
//   "BUILD YOU THING",
// ];
// export const BUILD_ANOTHER_STEP: [IDockerSteps, string] = [
//   "RUN",
//   "BUILD ANOTHER THING",
// ];

// Common configurations
// export const SINGLE_TEST_BLOCK: [IDockerSteps, string][][] = [NODE_TEST_STEPS];
// export const SINGLE_PROD_BLOCK: [IDockerSteps, string][][] = [
//   NODE_BASE_STEPS.concat([BUILD_PROD_STEP]),
// ];
// export const DOUBLE_PROD_BLOCK: [IDockerSteps, string][][] = [
//   NODE_BASE_STEPS.concat([BUILD_THING_STEP]),
//   NODE_BASE_STEPS.concat([BUILD_ANOTHER_STEP]),
// ];

// export const CHECKS_CONFIG: IChecks = {
//   eslint: [
//     [
//       ["WORKDIR", "/workspace"],
//       [
//         "RUN",
//         "npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin",
//       ],
//     ],
//     "npx eslint src/ --ext .ts,.tsx --max-warnings=0",
//   ],
//   typescript: [
//     [
//       ["WORKDIR", "/workspace"],
//       ["RUN", "npm install --save-dev typescript"],
//     ],
//     "npx tsc --noEmit",
//   ],
//   "audit-ci": [
//     [
//       ["WORKDIR", "/workspace"],
//       ["RUN", "npm install --save-dev audit-ci"],
//     ],
//     "npx audit-ci --critical",
//   ],
//   depcheck: [
//     [
//       ["WORKDIR", "/workspace"],
//       ["RUN", "npm install --save-dev depcheck"],
//     ],
//     "npx depcheck",
//   ],
// };

// export const createGolangLangConfig(test, check) => {
//   return
// };
