import {
  node_default
} from "../../../chunk-EH2APWUF.mjs";
import {
  runBuild
} from "../../../chunk-IOVEJAE6.mjs";
import "../../../chunk-SFBHYNUJ.mjs";
import "../../../chunk-3X2YHN6Q.mjs";

// src/server/runtimes/node/node.ts
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
async function runNodeTests() {
  console.log("NODE BUILDER: Build complete, running tests...");
  const bundlesDir = process.env.BUNDLES_DIR || "/workspace/testeranto/bundles/allTests/node";
  console.log(`Looking for test files in: ${bundlesDir}`);
  const testFiles = [];
  function findTestFiles(dir) {
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
  for (const testFile of testFiles) {
    console.log(`Running test: ${testFile}`);
    try {
      const testName = path.basename(testFile, ".test.mjs");
      const sourcePath = `src/tests/${testName}.test.ts`;
      const testResources = JSON.stringify({
        wsHost: "host.docker.internal",
        wsPort: 3456,
        ports: [3456],
        name: "node-test",
        fs: testFile.replace("bundles", "reports"),
        environment: {
          IN_DOCKER: "true",
          RUNTIME: "node"
        }
      });
      const child = spawn("node", [testFile, "3456", testResources], {
        stdio: "inherit"
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
async function main() {
  try {
    await runBuild(
      node_default,
      (config) => Object.keys(config.node.tests),
      "NODE"
    );
    await runNodeTests();
  } catch (error) {
    console.error("NODE BUILDER: Error during build or test execution:", error);
    process.exit(1);
  }
}
main();
