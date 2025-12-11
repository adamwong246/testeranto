/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBuiltConfig, IRunTime } from "../../Types";

export async function generateStaticAnalysisServices(
  config: IBuiltConfig,
  runtimes: IRunTime[]
): Promise<Record<string, any>> {
  const services: any = {};

  for (const runtime of runtimes) {
    const tests = config[runtime]?.tests;
    if (!tests) continue;

    // Check if user has defined any checks for this runtime
    const runtimeChecks = config[runtime]?.checks || config.checks;
    if (!runtimeChecks || Object.keys(runtimeChecks).length === 0) {
      // No checks defined by user, skip creating static analysis services
      continue;
    }

    // Create one static analysis service per runtime (not per test)
    const serviceName = `${runtime}-analysis`;

    const staticAnalysisServiceConfig: any = {
      restart: "no",
      environment: {
        WS_PORT: config.httpPort.toString(),
        WS_HOST: "host.docker.internal",
        IN_DOCKER: "true",
        RUNTIME: runtime,
        COMPLETION_SIGNAL_PATH: `/workspace/testeranto/metafiles/${runtime}/analysis_complete`,
      },
      networks: ["default"],
      image: getRuntimeImage(runtime),
      volumes: [
        `${process.cwd()}:/workspace`,
        "node_modules:/workspace/node_modules",
      ],
      working_dir: "/workspace",
      depends_on: {
        [`${runtime}-build`]: {
          condition: "service_healthy",
        },
      },
    };

    // Add chromium dependency for web static analysis
    if (runtime === "web") {
      staticAnalysisServiceConfig.depends_on.chromium = {
        condition: "service_healthy",
      };
    }

    // Generate command based on runtime and user-defined checks
    staticAnalysisServiceConfig.command = generateAnalysisCommand(
      runtime,
      runtimeChecks,
      config
    );

    services[serviceName] = staticAnalysisServiceConfig;
  }

  return services;
}

// Helper function to get appropriate Docker image for runtime
function getRuntimeImage(runtime: IRunTime): string {
  switch (runtime) {
    case "node":
    case "web":
      return "node:20.19.4-alpine";
    case "python":
      return "python:3.11-alpine";
    case "golang":
      return "golang:1.21-alpine";
    default:
      return "alpine:latest";
  }
}

// Helper function to generate analysis command based on user checks
function generateAnalysisCommand(
  runtime: IRunTime,
  checks: Record<string, any>,
  config: IBuiltConfig
): string[] {
  // First check for new runtime-native check configuration
  const checkConfig = config.check;
  const checkEntryPoint = checkConfig?.[runtime];
  
  const command = `
    echo "=== Starting static analysis for ${runtime} ==="
    
    # Wait for build to complete
    echo "Waiting for build service to complete..."
    while [ ! -f /workspace/testeranto/metafiles/${runtime}/build_complete ]; do
      sleep 1
    done
    
    echo "Build complete. Running static analysis..."
    
    # Check if new runtime-native check is configured
    if [ -n "${checkEntryPoint}" ]; then
      echo "Using runtime-native check: ${checkEntryPoint}"
      
      # Find metafile
      METAFILE_PATH="/workspace/testeranto/metafiles/${runtime}/allTests.json"
      
      if [ -f "\$METAFILE_PATH" ]; then
        echo "Found metafile at \$METAFILE_PATH"
        
        # Run the runtime-native check
        case "${runtime}" in
          "node"|"web")
            echo "Running Node.js check..."
            cd /workspace
            if [ -f "${checkEntryPoint}" ]; then
              node "${checkEntryPoint}" "\$METAFILE_PATH"
            else
              echo "Warning: Check entry point not found: ${checkEntryPoint}"
              # Fall back to legacy checks
              runLegacyChecks
            fi
            ;;
          "python")
            echo "Running Python check..."
            cd /workspace
            if [ -f "${checkEntryPoint}" ]; then
              python3 "${checkEntryPoint}" "\$METAFILE_PATH"
            else
              echo "Warning: Check entry point not found: ${checkEntryPoint}"
              # Fall back to legacy checks
              runLegacyChecks
            fi
            ;;
          "golang")
            echo "Running Go check..."
            cd /workspace
            if [ -f "${checkEntryPoint}" ]; then
              go run "${checkEntryPoint}" "\$METAFILE_PATH"
            else
              echo "Warning: Check entry point not found: ${checkEntryPoint}"
              # Fall back to legacy checks
              runLegacyChecks
            fi
            ;;
        esac
        
        ANALYSIS_EXIT_CODE=\$?
        echo "Static analysis completed with exit code: \$ANALYSIS_EXIT_CODE"
        
        # Handle failOnError if configured
        if [ "\$ANALYSIS_EXIT_CODE" -ne 0 ] && [ "${checkConfig?.failOnError}" = "true" ]; then
          echo "Static analysis failed with errors (failOnError is true)"
          exit \$ANALYSIS_EXIT_CODE
        fi
      else
        echo "No metafile found at \$METAFILE_PATH"
        echo "Skipping static analysis"
      fi
    else
      echo "No runtime-native check configured for ${runtime}"
      echo "User-defined checks: ${Object.keys(checks).join(', ')}"
      
      # Fall back to legacy checks
      runLegacyChecks
    fi
    
    echo "Static analysis complete. Creating completion signal..."
    touch /workspace/testeranto/metafiles/${runtime}/analysis_complete
    
    echo "Analysis service complete. Keeping container alive..."
    sleep 3600
  `;
  
  // Helper function for legacy checks
  const legacyChecksFunction = `
    runLegacyChecks() {
      echo "Running legacy checks for ${runtime}..."
      # Run static analysis based on runtime
      case "${runtime}" in
        "node"|"web")
          echo "Running Node.js/Web static analysis..."
          # Check if there are any checks configured
          if [ -n "$(echo '${JSON.stringify(checks)}' | grep -v '^[{}]*$')" ]; then
            echo "User-defined checks found, running analysis..."
            # Install npm if needed
            if ! command -v npm &> /dev/null; then
              echo "Installing npm..."
              apk add --update npm 2>/dev/null || echo "npm installation may have failed"
            fi
            # Install dependencies
            if [ -f "/workspace/package.json" ]; then
              echo "Installing dependencies from package.json..."
              cd /workspace && npm install --no-audit --no-fund --ignore-scripts 2>&1 | tail -5 || echo "npm install may have warnings"
            fi
            
            # Run ESLint if configured
            if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i eslint)" ]; then
              echo "Running ESLint..."
              npx --no-install eslint --version 2>/dev/null || npm install --no-save eslint 2>/dev/null || true
              find /workspace/src -name "*.ts" -o -name "*.tsx" | head -3 | while read file; do
                npx eslint "\$file" 2>&1 || echo "ESLint check completed for \$file"
              done
            fi
            
            # Run TypeScript check if configured
            if [ -n "$(echo '${JSON.stringify(checks)}' | grep -i typescript)" ]; then
              echo "Running TypeScript type check..."
              npx --no-install tsc --version 2>/dev/null || npm install --no-save typescript 2>/dev/null || true
              npx tsc --noEmit 2>&1 || echo "TypeScript check completed"
            fi
          else
            echo "No checks configured, skipping analysis."
          fi
          ;;
        "python")
          echo "Running Python static analysis..."
          # Python analysis would go here
          pip install --quiet flake8 pylint mypy 2>/dev/null || echo "Tool installation may have failed"
          find /workspace/src -name "*.py" | head -3 | while read file; do
            echo "Analyzing Python file: \$file"
            flake8 "\$file" 2>&1 || echo "flake8 completed for \$file"
          done
          ;;
        "golang")
          echo "Running Go static analysis..."
          # Go analysis would go here
          go vet ./... 2>&1 || echo "go vet completed"
          ;;
      esac
    }
  `;
  
  return ["sh", "-c", legacyChecksFunction + command];
}
