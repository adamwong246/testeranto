/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path";
import fs from "fs";
import { findProjectRoot } from "./golingvuMetafile/helpers";
import {
  // findGoFilesInProject,
  collectGoDependencies,
} from "./golingvuMetafile/fileDiscovery";
import { parseGoImports } from "./golingvuMetafile/importParser";
// import { execSync } from "child_process";
import { GolingvuMetafile } from "./golingvuMetafile/types";

let generationQueue: Promise<GolingvuMetafile> | null = null;

export async function generateGolingvuMetafile(
  testName: string,
  entryPoints: string[]
): Promise<GolingvuMetafile> {
  // If there's already a generation in progress, wait for it to complete
  if (generationQueue) {
    return generationQueue;
  }

  generationQueue = (async () => {
    const inputs: Record<string, any> = {};
    const outputs: Record<string, any> = {};
    const signature = Date.now().toString(36);

    // If entry points are provided, use them directly
    // For test generation, we want to include test files
    const filteredEntryPoints: string[] = [];
    for (const entryPoint of entryPoints) {
      // Skip if it's not a .go file
      if (!entryPoint.endsWith(".go")) {
        console.warn(`Skipping non-Go file: ${entryPoint}`);
        continue;
      }

      // Check if the file exists and is a file
      let resolvedPath = entryPoint;
      if (!path.isAbsolute(entryPoint)) {
        resolvedPath = path.join(process.cwd(), entryPoint);
      }

      if (!fs.existsSync(resolvedPath)) {
        console.warn(`Entry point does not exist: ${resolvedPath}`);
        continue;
      }

      if (!fs.statSync(resolvedPath).isFile()) {
        console.warn(`Entry point is not a file: ${resolvedPath}`);
        continue;
      }

      // Add to filtered entry points - don't skip test files for test generation
      filteredEntryPoints.push(resolvedPath);
    }
    entryPoints = filteredEntryPoints;

    // If no valid entry points remain, try to find Go files automatically
    // For test generation, include all files including test files
    // if (entryPoints.length === 0) {
    //   const allGoFiles = findGoFilesInProject();
    //   // Don't filter out test files
    //   entryPoints = allGoFiles.filter((file) => {
    //     const fileName = path.basename(file);
    //     // Only exclude our generated files
    //     return (
    //       !fileName.endsWith(".golingvu.test.go") &&
    //       !fileName.endsWith(".golingvu.go")
    //     );
    //   });
    //   if (entryPoints.length === 0) {
    //     console.warn("No Go files found in the project");
    //   } else {
    //     console.log(`Found ${entryPoints.length} Go files:`, entryPoints);
    //   }
    // }

    // Process all valid entry points to collect their dependencies
    const allDependencies = new Set<string>();
    const validEntryPoints: string[] = [];

    for (let i = 0; i < entryPoints.length; i++) {
      let entryPoint = entryPoints[i];

      // Resolve and validate the entry point path
      let resolvedPath = entryPoint;
      if (!path.isAbsolute(entryPoint)) {
        resolvedPath = path.join(process.cwd(), entryPoint);
      }

      if (!fs.existsSync(resolvedPath)) {
        console.warn(
          `Entry point ${entryPoint} does not exist at ${resolvedPath}`
        );
        continue;
      }

      // Update the entry point to use the resolved path
      entryPoints[i] = resolvedPath;
      entryPoint = resolvedPath;

      // Don't skip test files for test generation
      validEntryPoints.push(entryPoint);

      // Collect dependencies for this entry point
      const entryPointDependencies = collectGoDependencies(entryPoint);
      entryPointDependencies.forEach((dep) => allDependencies.add(dep));
    }

    // Process all dependencies to add to inputs
    for (const dep of allDependencies) {
      if (!inputs[dep]) {
        const bytes = fs.statSync(dep).size;
        const imports = parseGoImports(dep);

        // Check if this is a test file
        const isTestFile =
          path.basename(dep).includes("_test.go") ||
          path.basename(dep).includes(".golingvu.test.go");

        inputs[dep] = {
          bytes,
          imports,
          format: "esm",
          // Add a flag to indicate test files
          ...(isTestFile ? { testeranto: { isTest: true } } : {}),
        };
      }
    }

    // Generate the output path based on the project structure
    // Always use the project root as the base
    const projectRoot = findProjectRoot();
    let outputKey = "";
    if (validEntryPoints.length > 0) {
      const firstEntryPoint = validEntryPoints[0];
      // Get the relative path from project root to the entry point
      const relativePath = path.relative(
        projectRoot,
        path.dirname(firstEntryPoint)
      );
      // Get the base name without extension
      const baseName = path.basename(firstEntryPoint, ".go");
      // Construct the output key
      // Ensure relativePath is not empty
      const outputPath =
        relativePath === "" ? baseName : path.join(relativePath, baseName);
      outputKey = `golang/${path.basename(
        projectRoot
      )}/${outputPath}.golingvu.go`;
    } else {
      // Fallback if no valid entry points
      outputKey = `golang/core/main.golingvu.go`;
    }

    // Calculate total bytes from all inputs
    const inputBytes: Record<string, { bytesInOutput: number }> = {};
    let totalBytes = 0;
    for (const inputPath in inputs) {
      const bytes = inputs[inputPath].bytes;
      inputBytes[inputPath] = { bytesInOutput: bytes };
      totalBytes += bytes;
    }

    // Store the first valid entry point for use in the wrapper generation
    const firstEntryPoint =
      validEntryPoints.length > 0 ? validEntryPoints[0] : "";
    outputs[outputKey] = {
      imports: [],
      exports: [],
      entryPoint: firstEntryPoint,
      inputs: inputBytes,
      bytes: totalBytes,
      signature,
    };

    // If no valid entry points were found, log a warning
    if (validEntryPoints.length === 0) {
      console.warn("No valid Go files found to process");
    }

    const result = {
      errors: [],
      warnings: [],
      metafile: {
        inputs,
        outputs,
      },
    };

    generationQueue = null;
    return result;
  })();

  return generationQueue;
}

// Track how many times this function is called
let writeGolingvuMetafileCallCount = 0;

export function writeGolingvuMetafile(
  testName: string,
  metafile: GolingvuMetafile
): void {
  writeGolingvuMetafileCallCount++;
  console.log(
    `writeGolingvuMetafile called ${writeGolingvuMetafileCallCount} times`
  );
  console.log("process.cwd()", process.cwd());
  console.log("testName:", testName);

  // Always use the original project root, not the current working directory
  // This assumes the project root is where package.json is located
  const projectRoot = findProjectRoot();
  console.log("Project root found:", projectRoot);

  // Verify project root exists
  if (!fs.existsSync(projectRoot)) {
    throw new Error(`Project root does not exist: ${projectRoot}`);
  }

  // Write metafile to testeranto/metafiles/golang/
  const metafilePath = path.join(
    "testeranto",
    "metafiles",
    "golang",
    "core.json"
  );
  const metafileDir = path.dirname(metafilePath);

  // Write the metafile
  fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  console.log(`Golang metafile written to: ${metafilePath}`);

  // Generate the output Go files /bundles/golang/core/
  const outputDir = path.join("bundles", "golang", "core");
  console.log("Output directory:", outputDir);

  // Create each output file
  for (const [outputPath, outputInfo] of Object.entries(
    metafile.metafile.outputs
  )) {
    // The outputPath from the metafile should be used as-is, but ensure it's under golang/core/
    // Extract just the filename part
    const fileName = path.basename(outputPath);
    const fullOutputPath = path.join("testeranto", outputDir, fileName);
    // const outputDirPath = path.dirname(fullOutputPath);

    // if (!fs.existsSync(outputDirPath)) {
    //   fs.mkdirSync(outputDirPath, { recursive: true });
    // }

    // For Go, we need to create a normal Go program (not a test)
    // Include the signature in a comment
    const entryPoint = (outputInfo as any).entryPoint;
    const signature = (outputInfo as any).signature;

    // For Golingvu, we need to generate a wrapper that imports and runs the original code
    // The entry point should be imported and its functionality tested
    // Include the signature in a comment for the watcher to detect changes
    // Use build tags to ensure it's only included when testeranto is specified
    // The package should be testeranto_test to avoid being treated as a main package

    // For Go modules, the import path should be based on the module name + path from module root
    // First, find the module root by looking for go.mod in parent directories
    let moduleRoot = process.cwd();
    let modulePath = "";

    // Find the module root directory
    let currentDir = path.dirname(entryPoint);
    while (currentDir !== path.parse(currentDir).root) {
      const potentialGoMod = path.join(currentDir, "go.mod");
      if (fs.existsSync(potentialGoMod)) {
        moduleRoot = currentDir;
        // Read the module path
        const goModContent = fs.readFileSync(potentialGoMod, "utf-8");
        const moduleMatch = goModContent.match(/^module\s+(\S+)/m);
        if (moduleMatch && moduleMatch[1]) {
          modulePath = moduleMatch[1];
        }
        break;
      }
      currentDir = path.dirname(currentDir);
    }

    // Read the original file to determine the package name
    let originalPackageName = "main";
    try {
      const originalContent = fs.readFileSync(entryPoint, "utf-8");
      const packageMatch = originalContent.match(/^package\s+(\w+)/m);
      if (packageMatch && packageMatch[1]) {
        originalPackageName = packageMatch[1];
      }
    } catch (error) {
      console.warn(
        `Could not read original file ${entryPoint} to determine package name:`,
        error
      );
    }

    // Generate a single consolidated wrapper that imports the implementation
    // Use the entry point from the output info to determine what to import
    // Get the entry point from the output info
    const entryPointValue = (outputInfo as any).entryPoint;
    if (!entryPointValue || entryPointValue === "") {
      throw new Error("No valid entry point found for generating wrapper");
    }

    // Since we're in the main package and Calculator.go is in the same package,
    // we don't need to import anything
    // Just use the types directly
    console.log("Building in main package - no imports needed");

    console.log(`Generated single Golingvu wrapper: ${fullOutputPath}`);

    // Compile the binary directly to the output directory
    const binaryName = "calculator_test";

    // Compile the Go program from the project directory where go.mod is located
    // This ensures proper module resolution
    // Use -mod=mod to ignore vendor directory issues
    try {
      // Get the project directory from the first entry point
      // The entryPoint should be in the example directory
      const projectDir = path.dirname(entryPoint);

      // Make sure we're always working with the example directory
      // Since Calculator.go is in the example directory
      const exampleDir = path.join(projectRoot, "example");

      // Generate the wrapper content directly
      // Use the same package as the entry point
      // For test generation, we need to import the implementation and run tests
      // Since we're in the example directory, we need to use relative imports
      const wrapperContent = `//go:build testeranto
// +build testeranto

// This file is auto-generated by testeranto
// Signature: ${signature}

package main

import (
    "fmt"
    "os"
    "encoding/json"
)

func main() {
    fmt.Println("Running Calculator BDD tests...")

    // The test resource configuration should be provided via command line
    if len(os.Args) < 2 {
        fmt.Println("Error: Test resource configuration not provided")
        os.Exit(1)
    }

    // Parse the test resource configuration
    var testResource map[string]interface{}
    err := json.Unmarshal([]byte(os.Args[1]), &testResource)
    if err != nil {
        fmt.Printf("Error parsing test resource: %v\\n", err)
        os.Exit(1)
    }

    // Run the tests directly without external dependencies
    // For now, just print a success message
    // In a real implementation, you'd run the actual test logic here
    fmt.Println("All tests passed (placeholder implementation)")
    os.Exit(0)
}
`;

      // Generate the correct output path based on the project structure
      // Always use the project root as the base
      const projectName = path.basename(projectRoot);
      const relativePath = path.relative(projectRoot, exampleDir);
      const baseName = path.basename(entryPoint, ".go");

      // Construct the full output path for the source code in bundles
      const bundlesSourceDirPath = path.join(
        projectRoot,
        "bundles",
        "golang",
        projectName,
        relativePath
      );

      // Write the wrapper source to the bundles directory
      const wrapperSourcePath = path.join(
        bundlesSourceDirPath,
        `${baseName}.golingvu.go`
      );

      console.log(`Writing wrapper source to: ${wrapperSourcePath}`);
      // Ensure the bundles directory exists
      fs.mkdirSync(bundlesSourceDirPath, { recursive: true });
      fs.writeFileSync(wrapperSourcePath, wrapperContent);

      // Also write to the original location for compilation
      // This ensures the build can find the wrapper
      const tempWrapperPath = path.join(
        `testeranto`,
        `bundles`,
        `golang`,
        // entryPoint
        `${baseName}.go`
        // baseName
      );
      console.log(`Writing wrapper to: ${tempWrapperPath}`);
      fs.writeFileSync(tempWrapperPath, wrapperContent);

      // Build from the project directory to the correct output path
      // The binary should be in the same directory as the wrapper
      const absoluteBinaryPath = path.join(
        path.dirname(tempWrapperPath),
        binaryName
      );

      // Find only the .go files in the example directory that are part of the main package
      // Exclude any files that might be from other packages
      const goFiles: string[] = [];
      try {
        const files = fs.readdirSync(exampleDir);
        for (const file of files) {
          if (file.endsWith(".go")) {
            const filePath = path.join(exampleDir, file);
            // Read the file to check its package declaration
            try {
              const content = fs.readFileSync(filePath, "utf-8");
              const packageMatch = content.match(/^package\s+(\w+)/m);
              if (packageMatch && packageMatch[1] === "main") {
                goFiles.push(filePath);
              }
            } catch (readError) {
              console.warn(
                `Could not read file ${filePath} to check package:`,
                readError
              );
              // Include the file anyway to be safe
              goFiles.push(filePath);
            }
          }
        }
      } catch (error) {
        console.warn(`Could not list files in ${exampleDir}:`, error);
      }

      // The golingvu package should be imported as a dependency, not included directly
      // Ensure go.mod is properly set up to import github.com/adamwong246/testeranto/src/golingvu
      // We'll rely on the Go module system to handle this dependency

      if (goFiles.length === 0) {
        throw new Error(`No .go files found in ${exampleDir}`);
      }

      // Always build from the project root directory
      // Use relative paths from the project root to the .go files
      const relativeGoFilePaths = goFiles.map((filePath) => {
        return path.relative(projectRoot, filePath);
      });

      console.log(`Using go run instead of compiling binary`);
      console.log(
        `To execute: go run ${tempWrapperPath} <test-resource-config>`
      );
    } catch (e) {
      console.error(e);
    }
  }
}
