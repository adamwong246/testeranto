import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import nodeEsbuildConfig from "../../../esbuildConfigs/node.js";
import { runBuild } from "../common.js";

async function runNodeTests() {
  console.log("NODE BUILDER: Build complete, running tests...");

  // Determine the bundles directory
  const bundlesDir =
    process.env.BUNDLES_DIR || "/workspace/testeranto/bundles/allTests/node";
  console.log(`Looking for test files in: ${bundlesDir}`);

  // Find all .mjs test files
  const testFiles: string[] = [];

  function findTestFiles(dir: string) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory does not exist: ${dir}`);
      return;
    }
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findTestFiles(fullPath);
      } else if (item.endsWith(".test.mjs")) {
        testFiles.push(fullPath);
      }
    }
  }

  findTestFiles(bundlesDir);

  console.log(`Found ${testFiles}`);

  // Run each test file
  for (const testFile of testFiles) {
    console.log(`Running test: ${testFile}`);
    try {
      // Create test resources with host.docker.internal for WebSocket connection
      // fs should be the original source file path, not /workspace
      // Extract the test name from the bundled path
      const testName = path.basename(testFile, ".test.mjs"); // e.g., "Calculator"
      // Assume source file is at src/tests/${testName}.test.ts
      const sourcePath = `src/tests/${testName}.test.ts`;

      const testResources = JSON.stringify({
        wsHost: "host.docker.internal",
        wsPort: 3456,
        ports: [3456],
        name: "node-test",
        fs: testFile.replace("bundles", "reports"),
        environment: {
          IN_DOCKER: "true",
          RUNTIME: "node",
        },
      });

      // Run the test with proper test resources
      const child = spawn("node", [testFile, "3456", testResources], {
        stdio: "inherit",
      });

      await new Promise((resolve, reject) => {
        child.on("close", (code) => {
          if (code === 0) {
            console.log(`Test ${path.basename(testFile)} passed`);
            resolve(null);
          } else {
            console.log(
              `Test ${path.basename(testFile)} failed with code ${code}`
            );
            // Don't reject, just continue with other tests
            resolve(null);
          }
        });
        child.on("error", reject);
      });
    } catch (error) {
      console.error(`Error running test ${testFile}:`, error);
    }
  }

  console.log("NODE BUILDER: All tests completed");
}

// Run the build first, then run tests
async function main() {
  try {
    await runBuild(
      nodeEsbuildConfig,
      (config) => Object.keys(config.node.tests),
      "NODE"
    );
    // After build completes, run tests
    await runNodeTests();
  } catch (error) {
    console.error("NODE BUILDER: Error during build or test execution:", error);
    process.exit(1);
  }
}

main();
