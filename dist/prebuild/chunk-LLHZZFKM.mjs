import {
  __esm,
  __export
} from "./chunk-3X2YHN6Q.mjs";

// src/server/docker/buildService.ts
var buildService_exports = {};
__export(buildService_exports, {
  default: () => buildService_default
});
var buildService_default;
var init_buildService = __esm({
  "src/server/docker/buildService.ts"() {
    buildService_default = (runtime) => {
      return {
        build: {
          context: "/Users/adam/Code/testeranto",
          dockerfile: `testeranto/bundles/allTests/${runtime}/${runtime}.Dockerfile`,
          tags: [`bundles-${runtime}-build:latest`],
          args: runtime === "node" ? {
            NODE_MJS_HASH: "cab84cac12fc3913ce45e7e53425b8bb"
          } : {}
        },
        volumes: [
          "/Users/adam/Code/testeranto:/workspace",
          "node_modules:/workspace/node_modules"
        ],
        image: `bundles-${runtime}-build:latest`,
        restart: "unless-stopped",
        environment: {
          BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/${runtime}`,
          METAFILES_DIR: `/workspace/testeranto/metafiles/${runtime}`,
          // Don't serve files - Server_TCP will handle that
          ESBUILD_SERVE_PORT: "0",
          // Disable esbuild serve
          IN_DOCKER: "true"
          // Indicate we're running in Docker
        },
        extra_hosts: ["host.docker.internal:host-gateway"],
        command: [
          "sh",
          "-c",
          `echo 'Starting ${runtime} build in watch mode...'; 
                echo 'Installing dependencies in /workspace/node_modules...'; 
                cd /workspace &&                 # Remove any .npmrc files
                rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
                npm cache clean --force &&                 # Clear any npm authentication
                npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
                echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
                npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
                npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
                echo 'Creating output directory...'; 
                mkdir -p /workspace/testeranto/bundles/allTests/${runtime};
                mkdir -p /workspace/testeranto/metafiles/${runtime};
                echo 'BUNDLES_DIR env:' "$BUNDLES_DIR"; 
                
                echo "Starting build process for ${runtime}..."
                npx tsx dist/prebuild/server/builders/${runtime}.mjs allTests.ts dev || echo "Build process exited with code $?, but keeping container alive for health checks";
                
                # After build, run tests according to the "combined-build-test-process-pools" strategy
                echo "Build process finished. According to strategy 'combined-build-test-process-pools', tests should run within this container."
                echo "Looking for built test files in $BUNDLES_DIR..."
                
                # For Node.js runtime, run tests
                if [ "${runtime}" = "node" ]; then
                  echo "Running Node.js tests within the build container..."
                  # Find and run .mjs test files
                  if [ -d "$BUNDLES_DIR" ]; then
                    find "$BUNDLES_DIR" -name "*.test.mjs" -type f | while read testfile; do
                      echo "Running test: $testfile"
                      cd /workspace
                      
                      # Create proper test resources JSON
                      # Connect to host's WebSocket server using host.docker.internal
                      # fs should be the path to the test file relative to workspace root
                      # testfile is something like /workspace/testeranto/bundles/allTests/node/Calculator.test.mjs
                      # We need to extract the relative path from /workspace
                      # The original source file is likely at src/tests/Calculator.test.ts
                      # Extract the test name from the bundled path
                      TEST_NAME=$(basename "$testfile" .test.mjs)
                      # Assume source file is at src/tests/\${TEST_NAME}.test.ts
                      SOURCE_PATH="src/tests/\${TEST_NAME}.test.ts"
                      
                      TEST_RESOURCES='{
                        "wsHost": "host.docker.internal",
                        "wsPort": 3456,
                        "ports": [3456],
                        "name": "node-test",
                        "fs": "'"$SOURCE_PATH"'",
                        "environment": {
                          "IN_DOCKER": "true",
                          "RUNTIME": "node"
                        }
                      }'
                      
                      # Run test with proper test resources
                      echo "Test resources: $TEST_RESOURCES"
                      echo "Connecting to WebSocket at host.docker.internal:3456"
                      node "$testfile" 3456 "$TEST_RESOURCES" || echo "Test $testfile exited with code $?"
                    done
                  else
                    echo "BUNDLES_DIR $BUNDLES_DIR does not exist"
                    ls -la /workspace/testeranto/bundles/ || echo "Cannot list bundles directory"
                  fi
                fi
                
                # For Python runtime, run tests
                if [ "${runtime}" = "python" ]; then
                  echo "Running Python tests within the build container..."
                  # Find and run .py test files
                  if [ -d "$BUNDLES_DIR" ]; then
                    find "$BUNDLES_DIR" -name "*.test.py" -type f | while read testfile; do
                      echo "Running test: $testfile"
                      cd /workspace
                      
                      # Create proper test resources JSON for Python
                      # Extract test name and assume source path
                      TEST_NAME=$(basename "$testfile" .test.py)
                      # For Python, assume source is at src/tests/\${TEST_NAME}.test.py
                      SOURCE_PATH="src/tests/\${TEST_NAME}.test.py"
                      
                      TEST_RESOURCES='{
                        "wsHost": "host.docker.internal",
                        "wsPort": 3456,
                        "ports": [3456],
                        "name": "python-test",
                        "fs": "'"$SOURCE_PATH"'",
                        "environment": {
                          "IN_DOCKER": "true",
                          "RUNTIME": "python"
                        }
                      }'
                      
                      # Run test with proper test resources
                      echo "Test resources: $TEST_RESOURCES"
                      echo "Connecting to WebSocket at host.docker.internal:3456"
                      python3 "$testfile" 3456 "$TEST_RESOURCES" || echo "Test $testfile exited with code $?"
                    done
                  else
                    echo "BUNDLES_DIR $BUNDLES_DIR does not exist"
                  fi
                fi
                
                echo "Test execution completed. Keeping container alive for health checks..."
                while true; do
                  sleep 3600
                done`
        ],
        // command: [
        //   "sh",
        //   "-c",
        //   `echo 'Starting node build in watch mode...';
        //                     echo 'Installing dependencies in /workspace/node_modules...';
        //                     cd /workspace &&                 # Remove any .npmrc files
        //                     rm -f .npmrc .npmrc.* || true &&                 # Clear npm cache and authentication
        //                     npm cache clean --force &&                 # Clear any npm authentication
        //                     npm config delete _auth 2>/dev/null || true &&                 npm config delete _authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_authToken 2>/dev/null || true &&                 npm config delete //registry.npmjs.org/:_auth 2>/dev/null || true &&                 npm config delete always-auth 2>/dev/null || true &&                 npm config delete registry 2>/dev/null || true &&                 npm config set registry https://registry.npmjs.org/ &&                 npm config set always-auth false &&                 npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts --no-optional || echo "npm install may have warnings";
        //                     echo 'Ensuring esbuild and esbuild-sass-plugin are installed for Linux platform...';
        //                     npm list esbuild 2>/dev/null || npm install --no-save esbuild@0.20.1 --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild installation may have issues";
        //                     npm list esbuild-sass-plugin 2>/dev/null || npm install --no-save esbuild-sass-plugin --no-audit --no-fund --ignore-scripts --no-optional || echo "esbuild-sass-plugin installation may have issues";
        //                     echo 'Creating output directory...';
        //                     mkdir -p /workspace/testeranto/bundles/allTests/${runtime};
        //                     mkdir -p /workspace/testeranto/metafiles/${runtime};
        //                     echo 'BUNDLES_DIR env:' "$BUNDLES_DIR";
        //                     # Create a dummy allTests.json to pass health check initially
        //                     echo '{"status":"building"}' > /workspace/testeranto/metafiles/${runtime}/allTests.json;
        //                     # Run in watch mode and keep the process alive
        //                     npx tsx ${runtime}.mjs allTests.ts dev || echo "Build process exited, but keeping container alive for health checks";
        //                     # Keep the container running even if the build command exits
        //                     while true; do
        //                       sleep 3600
        //                     done`,
        // ],
        healthcheck: {
          test: [
            "CMD-SHELL",
            `[ -f /workspace/testeranto/metafiles/${runtime}/allTests.json ] && echo "healthy" || exit 1`
          ],
          interval: "10s",
          timeout: "30s",
          retries: 10,
          start_period: "60s"
        }
      };
    };
  }
});

export {
  buildService_default,
  buildService_exports,
  init_buildService
};
