/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDockerSteps, IChecks, IStrategy, Itest } from "./src/Types";

// Helper to get appropriate steps based on flavor
function getStepsForFlavor(
  flavor: ["compiled" | "interpreted" | "VM" | "chrome", string]
): {
  base: [IDockerSteps, string][];
  staticAnalysis: [IDockerSteps, string][];
  metafileAnalysis: [IDockerSteps, string][];
  test: [IDockerSteps, string][];
} {
  const [flavorType] = flavor;
  const image = flavor[1];
  switch (flavorType) {
    case "interpreted":
      if (image.includes("python")) {
        return {
          base: PYTHON_BASE_STEPS,
          staticAnalysis: [], // Keep empty for now, focus on metafile-based
          metafileAnalysis: PYTHON_METAFILE_ANALYSIS,
          test: PYTHON_TEST_STEPS,
        };
      } else {
        return {
          base: NODE_BASE_STEPS,
          staticAnalysis: [], // Keep empty for now, focus on metafile-based
          metafileAnalysis: NODE_METAFILE_ANALYSIS,
          test: NODE_TEST_STEPS,
        };
      }
    case "compiled":
      return {
        base: GOLANG_BASE_STEPS,
        staticAnalysis: [], // Keep empty for now, focus on metafile-based
        metafileAnalysis: GOLANG_METAFILE_ANALYSIS,
        test: GOLANG_TEST_STEPS,
      };
    case "chrome":
      return {
        base: WEB_BASE_STEPS,
        staticAnalysis: [], // Keep empty for now, focus on metafile-based
        metafileAnalysis: WEB_METAFILE_ANALYSIS,
        test: WEB_TEST_STEPS,
      };
    default:
      return {
        base: NODE_BASE_STEPS,
        staticAnalysis: [], // Keep empty for now, focus on metafile-based
        metafileAnalysis: NODE_METAFILE_ANALYSIS,
        test: NODE_TEST_STEPS,
      };
  }
}

// Base steps for different categories
export const NODE_BASE_STEPS: [IDockerSteps, string][] = [
  ["RUN", "apk add --update make g++ linux-headers python3 libxml2-utils"],
  ["WORKDIR", "/workspace"],
  ["COPY", "package*.json ./ "],
  ["RUN", "npm install --legacy-peer-deps"],
  ["COPY", "./src ./src"],
];

export const PYTHON_BASE_STEPS: [IDockerSteps, string][] = [
  ["WORKDIR", "/workspace"],
  ["COPY", "requirements.txt ./ "],
  ["RUN", "pip install -r requirements.txt"],
  // Install Python linting tools and websockets for WebSocket communication
  ["RUN", "pip install pylint mypy flake8 websockets>=12.0"],
  ["COPY", "./src ./src"],
];

export const GOLANG_BASE_STEPS: [IDockerSteps, string][] = [
  ["WORKDIR", "/workspace"],
  ["COPY", "go.mod go.sum ./ "],
  ["RUN", "go mod download"],
  ["COPY", "./src ./src"],
];

export const WEB_BASE_STEPS: [IDockerSteps, string][] = [
  ["RUN", "apk add --update make g++ linux-headers python3 libxml2-utils"],
  ["WORKDIR", "/workspace"],
  ["COPY", "package*.json ./ "],
  ["RUN", "npm install --legacy-peer-deps"],
  ["COPY", "./src ./src"],
];

// Static analysis that uses a metafile to analyze only relevant files
// The metafile path is expected to be in $METAFILE_PATH environment variable
export const NODE_METAFILE_ANALYSIS: [IDockerSteps, string][] = [
  ...NODE_BASE_STEPS,
  [
    "RUN",
    "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx eslint ' + files.join(' ')).status); } else { console.log('No files to lint'); } \"",
  ],
  [
    "RUN",
    "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx tsc --noEmit ' + files.join(' ')).status); } else { console.log('No files to type-check'); } \"",
  ],
];

export const WEB_METAFILE_ANALYSIS: [IDockerSteps, string][] = [
  ...WEB_BASE_STEPS,
  [
    "RUN",
    "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx eslint ' + files.join(' ')).status); } else { console.log('No files to lint'); } \"",
  ],
  [
    "RUN",
    "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx tsc --noEmit ' + files.join(' ')).status); } else { console.log('No files to type-check'); } \"",
  ],
  [
    "RUN",
    "node -e \"export const fs = require('fs'); export const metafile = JSON.parse(fs.readFileSync(process.env.METAFILE_PATH, 'utf8')); export const files = metafile.inputs ? Object.keys(metafile.inputs) : []; if (files.length > 0) { process.exit(require('child_process').execSync('npx stylelint ' + files.filter(f => f.endsWith('.css') || f.endsWith('.scss')).join(' ')).status); } else { console.log('No style files to check'); } \"",
  ],
];

export const PYTHON_METAFILE_ANALYSIS: [IDockerSteps, string][] = [
  ...PYTHON_BASE_STEPS,
  // Create a script to run static analysis based on metafile
  [
    "RUN",
    `cat > /tmp/run_python_analysis.py << 'EOF'
import json
import os
import subprocess
import sys

def run_analysis():
    metafile_path = os.environ.get('METAFILE_PATH')
    if not metafile_path or not os.path.exists(metafile_path):
        print("No metafile found at METAFILE_PATH")
        return 0
    
    with open(metafile_path, 'r') as f:
        data = json.load(f)
    
    # Get input files from metafile
    inputs = data.get('inputs', {})
    files = list(inputs.keys()) if isinstance(inputs, dict) else []
    
    if not files:
        print("No files to analyze")
        return 0
    
    # Filter for Python files
    python_files = [f for f in files if f.endswith('.py')]
    if not python_files:
        print("No Python files to analyze")
        return 0
    
    exit_code = 0
    
    # Run flake8
    print("Running flake8...")
    result = subprocess.run(['flake8'] + python_files, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        exit_code = result.returncode
    
    # Run pylint
    print("Running pylint...")
    result = subprocess.run(['pylint'] + python_files, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        exit_code = result.returncode
    
    # Run mypy
    print("Running mypy...")
    result = subprocess.run(['mypy'] + python_files, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        exit_code = result.returncode
    
    return exit_code

if __name__ == '__main__':
    sys.exit(run_analysis())
EOF`,
  ],
  ["RUN", "python3 /tmp/run_python_analysis.py"],
];

export const GOLANG_METAFILE_ANALYSIS: [IDockerSteps, string][] = [
  ...GOLANG_BASE_STEPS,
  [
    "RUN",
    'sh -c \'if [ -f "$METAFILE_PATH" ]; then go vet $(jq -r ".inputs | keys[]" "$METAFILE_PATH" 2>/dev/null | grep "\\.go$" | xargs echo); else echo "No metafile for go vet"; fi\'',
  ],
  [
    "RUN",
    'sh -c \'if [ -f "$METAFILE_PATH" ]; then staticcheck $(jq -r ".inputs | keys[]" "$METAFILE_PATH" 2>/dev/null | grep "\\.go$" | xargs echo); else echo "No metafile for staticcheck"; fi\'',
  ],
];

// Test execution steps with static analysis pre-test
export const NODE_TEST_STEPS: [IDockerSteps, string][] = [
  ...NODE_BASE_STEPS,
  // Static analysis happens before running tests
  // The metafile would be generated during dependency installation or build
  ...NODE_METAFILE_ANALYSIS.slice(NODE_BASE_STEPS.length), // Only the analysis steps
  ["RUN", "npm test"],
];

// Web build steps with static analysis pre-build
export const WEB_BUILD_STEPS: [IDockerSteps, string][] = [
  ...WEB_BASE_STEPS,
  // Static analysis happens before bundling for the browser
  ...WEB_METAFILE_ANALYSIS.slice(WEB_BASE_STEPS.length), // Only the analysis steps
  ["RUN", "npm run build"], // Assuming there's a build step
];

export const WEB_TEST_STEPS: [IDockerSteps, string][] = [
  ...WEB_BASE_STEPS,
  ["RUN", "npm test"],
];

export const PYTHON_TEST_STEPS: [IDockerSteps, string][] = [
  ...PYTHON_BASE_STEPS,
  // Verify required packages are installed
  [
    "RUN",
    "python3 -c \"import sys; import subprocess; import pkg_resources; required = {'pylint', 'mypy', 'flake8', 'websockets'}; installed = {pkg.key for pkg in pkg_resources.working_set}; missing = required - installed; print('Missing packages:', missing) if missing else print('All required packages installed')\"",
  ],
  // Static analysis happens before running tests
  ...PYTHON_METAFILE_ANALYSIS.slice(PYTHON_BASE_STEPS.length), // Only the analysis steps
  ["RUN", "pytest"],
];

export const GOLANG_TEST_STEPS: [IDockerSteps, string][] = [
  ...GOLANG_BASE_STEPS,
  ["RUN", "go test ./..."],
];

export const BUILD_PROD_STEP: [IDockerSteps, string] = [
  "RUN",
  "BUILD YOU PRODUCTION BUNDLE",
];
export const BUILD_THING_STEP: [IDockerSteps, string] = [
  "RUN",
  "BUILD YOU THING",
];
export const BUILD_ANOTHER_STEP: [IDockerSteps, string] = [
  "RUN",
  "BUILD ANOTHER THING",
];

// Common configurations
export const SINGLE_TEST_BLOCK: [IDockerSteps, string][][] = [
  NODE_TEST_STEPS, // Default, will be overridden per flavor
];
export const SINGLE_PROD_BLOCK: [IDockerSteps, string][][] = [
  NODE_BASE_STEPS.concat([BUILD_PROD_STEP]),
];
export const DOUBLE_PROD_BLOCK: [IDockerSteps, string][][] = [
  NODE_BASE_STEPS.concat([BUILD_THING_STEP]),
  NODE_BASE_STEPS.concat([BUILD_ANOTHER_STEP]),
];

export const CHECKS_CONFIG: IChecks = {
  lint: NODE_METAFILE_ANALYSIS,
  typeCheck: NODE_METAFILE_ANALYSIS,
  metafileAnalysis: NODE_METAFILE_ANALYSIS,
};

// Build steps for compiled languages (separate from test)
// For Go, static analysis happens post-build
export const GOLANG_BUILD_STEPS: [IDockerSteps, string][] = [
  ...GOLANG_BASE_STEPS,
  ["RUN", "go build -o /tmp/test-binary ./..."],
  // After building, run static analysis on the source files
  // The metafile would be generated during the build process
  // We'll need to set METAFILE_PATH to point to it
  ...GOLANG_METAFILE_ANALYSIS.slice(GOLANG_BASE_STEPS.length), // Only the analysis steps
];

export const createLangConfig = (
  flavor: ["compiled" | "interpreted" | "VM" | "chrome", string],
  testFile: string,
  options?: {
    plugins?: any[];
    loaders?: Record<string, string>;
    externals?: string[];
    testBlocks?: [IDockerSteps, string][][];
    prodBlocks?: [IDockerSteps, string][][];
    checks?: IChecks;
    strategy?: IStrategy;
    build?: Itest;
    processPool?: {
      maxConcurrent: number;
      timeoutMs: number;
    };
    chrome?: {
      sharedInstance: boolean;
      maxContexts: number;
      memoryLimitMB: number;
    };
  }
) => {
  // Determine strategy based on flavor if not provided
  let strategy: IStrategy;
  if (options?.strategy) {
    strategy = options.strategy;
  } else {
    const [flavorType] = flavor;
    switch (flavorType) {
      case "interpreted":
        strategy = "combined-build-test-process-pools";
        break;
      case "compiled":
        strategy = "separate-build-combined-test";
        break;
      case "chrome":
        strategy = "combined-service-shared-chrome";
        break;
      case "VM":
        strategy = "combined-service-shared-jvm";
        break;
      default:
        strategy = "combined-build-test-process-pools";
    }
  }

  // Get appropriate steps for this flavor
  const { base, staticAnalysis, metafileAnalysis, test } =
    getStepsForFlavor(flavor);

  // Determine phase based on strategy
  let phase: "pre-build" | "post-build" | "pre-test" | "post-test";
  switch (strategy) {
    case "separate-build-combined-test": // Compiled languages
      phase = "post-build"; // Static analysis after compilation, before test execution
      break;
    case "combined-build-test-process-pools": // Interpreted languages
      phase = "pre-test"; // Static analysis before test execution in the same service
      break;
    case "combined-service-shared-chrome": // Web
      phase = "pre-build"; // Static analysis before bundling assets
      break;
    case "combined-service-shared-jvm": // VM languages
      phase = "post-build"; // Static analysis after compilation
      break;
    default:
      phase = "pre-test";
  }

  // Create configurations
  const defaultTestBlock = [test];
  const defaultChecks: IChecks = {
    lint: metafileAnalysis, // Use metafile-based analysis for lint
    typeCheck: metafileAnalysis, // Use metafile-based analysis for type check
    staticAnalysis: staticAnalysis,
    metafileAnalysis: metafileAnalysis,
    phase: phase,
  };

  return {
    plugins: options?.plugins || [],
    loaders: options?.loaders || {},
    tests: { [testFile]: { ports: 0 } },
    externals: options?.externals || [],
    flavor,
    strategy,
    test: options?.testBlocks || defaultTestBlock,
    prod: options?.prodBlocks || [base.concat([BUILD_PROD_STEP])],
    checks: options?.checks || defaultChecks,
    build: options?.build,
    processPool: options?.processPool,
    chrome: options?.chrome,
  };
};
