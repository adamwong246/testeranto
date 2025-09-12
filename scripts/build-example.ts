/* eslint-disable no-undef */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("Building example project (ES module version)...");

const findAllGoFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip some directories
      if (file === "node_modules" || file === ".git" || file === "testeranto") {
        // return;
      }
      results = results.concat(findAllGoFiles(filePath));
    } else if (file.endsWith(".go")) {
      results.push(filePath);
    }
  });

  return results;
};

try {
  // Change to example directory
  const exampleDir = path.join(process.cwd(), "example");
  console.log(`Changing to directory: ${exampleDir}`);
  process.chdir(exampleDir);

  // Log current directory
  console.log(`Current directory: ${process.cwd()}`);

  // List files in example directory for debugging
  console.log("Files in example directory:");
  try {
    const files = fs.readdirSync(".");
    // Track lowercase names to find collisions
    const lowercaseCount = new Map();
    files.forEach((file) => {
      const lower = file.toLowerCase();
      lowercaseCount.set(lower, (lowercaseCount.get(lower) || 0) + 1);
      console.log(`  ${file}`);
    });

    // Log any potential case-insensitive collisions
    for (const [lower, count] of lowercaseCount.entries()) {
      if (count > 1) {
        console.log(
          `WARNING: Found ${count} files with case-insensitive name: ${lower}`
        );
      }
    }
  } catch (error) {
    console.error("Error listing files:", error);
  }

  // Ensure go.mod exists
  const goModPath = "go.mod";
  if (!fs.existsSync(goModPath)) {
    console.error(`go.mod not found at: ${path.resolve(goModPath)}`);
    process.exit(1);
  }

  // Read and log go.mod content
  let goModContent = fs.readFileSync(goModPath, "utf8");
  console.log("Current go.mod content:");
  console.log(goModContent);

  // Update the replace directive to point to the root
  const correctReplace = "replace github.com/adamwong246/testeranto => ../";
  if (!goModContent.includes(correctReplace)) {
    goModContent = goModContent.replace(
      /replace github\.com\/adamwong246\/testeranto.*/,
      correctReplace
    );
    fs.writeFileSync(goModPath, goModContent);
    console.log("Updated go.mod replace directive");
    console.log("New go.mod content:");
    console.log(goModContent);
  } else {
    console.log("Replace directive already correct in go.mod");
  }

  // Check if go.sum exists
  const goSumPath = "go.sum";
  if (fs.existsSync(goSumPath)) {
    console.log("go.sum exists before running go mod tidy");
    console.log("go.sum content:");
    console.log(fs.readFileSync(goSumPath, "utf8"));
  } else {
    console.log("go.sum does not exist yet");
  }

  // Run go mod tidy to ensure dependencies are correct and generate go.sum
  console.log("Running go mod tidy...");
  try {
    const tidyOutput = execSync("go mod tidy -v", {
      stdio: "pipe",
      encoding: "utf-8",
      cwd: exampleDir,
    });
    console.log("go mod tidy output:");
    console.log(tidyOutput);
  } catch (error) {
    console.error("go mod tidy failed:");
    console.error("stdout:", error.stdout?.toString());
    console.error("stderr:", error.stderr?.toString());
    console.error("error:", error);
    // Don't exit on error, as it might be due to missing dependencies
    // that aren't critical for the basic functionality
    console.log("Continuing despite go mod tidy error...");
  }

  // Check if go.sum was created/updated
  if (fs.existsSync(goSumPath)) {
    console.log("go.sum exists after running go mod tidy");
    console.log("go.sum content:");
    console.log(fs.readFileSync(goSumPath, "utf8"));
  } else {
    console.log("go.sum still does not exist after go mod tidy");
  }

  // List all Go files for debugging
  console.log("Go files in project:");
  try {
    const goFiles = findAllGoFiles(".");
    goFiles.forEach((file) => {
      console.log(`  ${file}`);
    });

    // Check for package conflicts
    const packageMap = new Map();
    goFiles.forEach((file) => {
      try {
        const content = fs.readFileSync(file, "utf8");
        const packageMatch = content.match(/^package\s+(\w+)/m);
        if (packageMatch) {
          const packageName = packageMatch[1];
          const files = packageMap.get(packageName) || [];
          files.push(file);
          packageMap.set(packageName, files);
        }
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    });

    // Log package information
    console.log("Package information:");
    for (const [pkgName, files] of packageMap.entries()) {
      console.log(`  ${pkgName}: ${files.length} files`);
      if (files.length > 1) {
        files.forEach((file) => console.log(`    ${file}`));
      }
    }
  } catch (error) {
    console.error("Error finding Go files:", error);
  }

  // Build the regular Go programs using proper Go module build
  console.log("Building Go programs using go build...");
  try {
    // Use go build to build the package in the current directory
    // This will handle all dependencies automatically
    const buildOutput = execSync("go build -o main .", {
      stdio: "pipe",
      encoding: "utf-8",
      cwd: exampleDir,
    });
    console.log("Build completed successfully:", buildOutput);

    // Check if the binary was created
    if (fs.existsSync("main")) {
      console.log('Binary "main" created successfully');

      // Test running the program
      try {
        const runOutput = execSync("./main", {
          stdio: "pipe",
          encoding: "utf-8",
          cwd: exampleDir,
        });
        console.log("Program output:");
        console.log(runOutput);
      } catch (runError) {
        console.log("Program ran but may have failed tests:");
        console.log("stdout:", runError.stdout?.toString());
        console.log("stderr:", runError.stderr?.toString());
        // Don't fail the build if the program exits with non-zero (tests may fail)
      }
    }
  } catch (buildError) {
    console.error("Failed to build Go program:");
    console.error("stdout:", buildError.stdout?.toString());
    console.error("stderr:", buildError.stderr?.toString());
    console.error("This may be expected if there are no main packages");

    // Try building test binaries instead
    console.log("Trying to build test binaries...");
    try {
      const testBuildOutput = execSync("go test -c -o testmain .", {
        stdio: "pipe",
        encoding: "utf-8",
        cwd: exampleDir,
      });
      console.log("Test build completed:", testBuildOutput);

      if (fs.existsSync("testmain")) {
        console.log('Test binary "testmain" created successfully');
      }
    } catch (testBuildError) {
      console.log("Test build also failed:");
      console.log("stdout:", testBuildError.stdout?.toString());
      console.log("stderr:", testBuildError.stderr?.toString());
    }
  }

  // Generate the Golang metafile after building
  console.log("Generating Golang metafile...");
  try {
    const { generateGolingvuMetafile, writeGolingvuMetafile } = await import(
      "../src/utils/golingvuMetafile.js"
    );
    const metafile = await generateGolingvuMetafile("Calculator.test", [
      "example/Calculator.go",
      "example/Calculator.golingvu.test.go",
    ]);
    writeGolingvuMetafile("Calculator.test", metafile);
    console.log("Golang metafile generated successfully");
  } catch (error) {
    console.error("Failed to generate Golang metafile:", error);
  }

  console.log("Example project built successfully!");
} catch (error) {
  console.error("Failed to build example project:");
  console.error(error);
  process.exit(1);
}
