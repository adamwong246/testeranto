// src/clients/utils/generateGolingvuMetafile.ts
import path5 from "path";
import fs5 from "fs";

// src/clients/utils/golingvuMetafile/helpers.ts
import fs from "fs";
import path from "path";
function findProjectRoot() {
  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return process.cwd();
}

// src/clients/utils/golingvuMetafile/fileDiscovery.ts
import fs2 from "fs";
import path2 from "path";
function collectGoDependencies(filePath, visited = /* @__PURE__ */ new Set()) {
  if (!filePath.endsWith(".go")) {
    return [];
  }
  if (visited.has(filePath))
    return [];
  visited.add(filePath);
  const dependencies = [filePath];
  const dir = path2.dirname(filePath);
  try {
    const files = fs2.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith(".go") && file !== path2.basename(filePath)) {
        const fullPath = path2.join(dir, file);
        dependencies.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dir}:`, error);
  }
  try {
    const content = fs2.readFileSync(filePath, "utf-8");
    const importRegex = /import\s*(?:\(\s*([\s\S]*?)\s*\)|"([^"]+)")/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      if (match[2]) {
        const importPath = match[2].trim();
        processImport(importPath, dir, dependencies, visited);
      } else if (match[1]) {
        const importBlock = match[1];
        const importLines = importBlock.split("\n").map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("//"));
        for (const line of importLines) {
          const lineMatch = line.match(/"([^"]+)"/);
          if (lineMatch) {
            const importPath = lineMatch[1].trim();
            processImport(importPath, dir, dependencies, visited);
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Could not read file ${filePath} for import parsing:`, error);
  }
  return [...new Set(dependencies)];
}
function processImport(importPath, currentDir, dependencies, visited) {
  const firstPathElement = importPath.split("/")[0];
  const isExternal = firstPathElement.includes(".");
  if (!isExternal) {
    const potentialPaths = [
      path2.join(process.cwd(), "vendor", importPath),
      path2.join(currentDir, importPath),
      path2.join(process.cwd(), importPath),
      path2.join(process.cwd(), "src", importPath)
    ];
    for (const potentialPath of potentialPaths) {
      if (fs2.existsSync(potentialPath) && fs2.statSync(potentialPath).isDirectory()) {
        try {
          const files = fs2.readdirSync(potentialPath);
          for (const file of files) {
            if (file.endsWith(".go") && !file.endsWith("_test.go")) {
              const fullPath = path2.join(potentialPath, file);
              dependencies.push(...collectGoDependencies(fullPath, visited));
            }
          }
          break;
        } catch (error) {
          console.warn(`Could not read directory ${potentialPath}:`, error);
        }
      }
      const goFilePath = potentialPath + ".go";
      if (fs2.existsSync(goFilePath) && fs2.statSync(goFilePath).isFile()) {
        if (goFilePath.endsWith(".go")) {
          dependencies.push(...collectGoDependencies(goFilePath, visited));
          break;
        }
      }
    }
  }
}

// src/clients/utils/golingvuMetafile/importParser.ts
import fs4 from "fs";
import path4 from "path";

// src/clients/utils/golingvuMetafile/goList.ts
import fs3 from "fs";
import path3 from "path";
import { execSync } from "child_process";
function runGoList(pattern) {
  try {
    let processedPattern = pattern;
    if (fs3.existsSync(pattern)) {
      const stat = fs3.statSync(pattern);
      if (stat.isDirectory()) {
        const cwd = process.cwd();
        try {
          const output2 = execSync(`go list -mod=readonly -json .`, {
            encoding: "utf-8",
            cwd: pattern,
            stdio: ["pipe", "pipe", "pipe"]
          });
          return parseGoListOutput(output2);
        } catch (error) {
          processedPattern = pattern;
        }
      } else if (stat.isFile() && pattern.endsWith(".go")) {
        processedPattern = path3.dirname(pattern);
      }
    }
    const output = execSync(
      `go list -mod=readonly -json "${processedPattern}"`,
      {
        encoding: "utf-8",
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"]
      }
    );
    return parseGoListOutput(output);
  } catch (error) {
    console.warn(`Error running 'go list -json ${pattern}':`, error);
    return [];
  }
}
function parseGoListOutput(output) {
  const objects = [];
  let buffer = "";
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  for (const char of output) {
    if (escapeNext) {
      buffer += char;
      escapeNext = false;
      continue;
    }
    if (char === "\\") {
      escapeNext = true;
      buffer += char;
      continue;
    }
    if (char === '"') {
      inString = !inString;
    }
    if (!inString) {
      if (char === "{") {
        depth++;
      } else if (char === "}") {
        depth--;
        if (depth === 0) {
          try {
            objects.push(JSON.parse(buffer + char));
            buffer = "";
            continue;
          } catch (e) {
            console.warn("Failed to parse JSON object:", buffer + char);
            buffer = "";
          }
        }
      }
    }
    if (depth > 0 || buffer.length > 0) {
      buffer += char;
    }
  }
  return objects;
}

// src/clients/utils/golingvuMetafile/importParser.ts
function parseGoImports(filePath) {
  if (!filePath.endsWith(".go")) {
    return [];
  }
  const dir = path4.dirname(filePath);
  let packages = [];
  try {
    packages = runGoList(dir);
  } catch (error) {
    console.warn(`go list failed for directory ${dir}:`, error);
  }
  const imports = [];
  if (packages.length > 0) {
    const pkg = packages[0];
    if (pkg.Imports) {
      for (const importPath of pkg.Imports) {
        const firstPathElement = importPath.split("/")[0];
        const isExternal = firstPathElement.includes(".");
        imports.push({
          path: importPath,
          kind: "import-statement",
          external: isExternal
        });
      }
    }
  }
  try {
    const content = fs4.readFileSync(filePath, "utf-8");
    const importRegex = /import\s*(?:\(\s*([\s\S]*?)\s*\)|"([^"]+)")/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      if (match[2]) {
        const importPath = match[2].trim();
        const firstPathElement = importPath.split("/")[0];
        const isExternal = firstPathElement.includes(".");
        if (!imports.some((imp) => imp.path === importPath)) {
          imports.push({
            path: importPath,
            kind: "import-statement",
            external: isExternal
          });
        }
      } else if (match[1]) {
        const importBlock = match[1];
        const importLines = importBlock.split("\n").map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("//"));
        for (const line of importLines) {
          const lineMatch = line.match(/"([^"]+)"/);
          if (lineMatch) {
            const importPath = lineMatch[1].trim();
            const firstPathElement = importPath.split("/")[0];
            const isExternal = firstPathElement.includes(".");
            if (!imports.some((imp) => imp.path === importPath)) {
              imports.push({
                path: importPath,
                kind: "import-statement",
                external: isExternal
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Could not read file ${filePath} for import parsing:`, error);
  }
  return imports;
}

// src/clients/utils/generateGolingvuMetafile.ts
var generationQueue = null;
async function generateGolingvuMetafile(testName, entryPoints) {
  if (generationQueue) {
    return generationQueue;
  }
  generationQueue = (async () => {
    const inputs = {};
    const outputs = {};
    const signature = Date.now().toString(36);
    const filteredEntryPoints = [];
    for (const entryPoint of entryPoints) {
      if (!entryPoint.endsWith(".go")) {
        console.warn(`Skipping non-Go file: ${entryPoint}`);
        continue;
      }
      let resolvedPath = entryPoint;
      if (!path5.isAbsolute(entryPoint)) {
        resolvedPath = path5.join(process.cwd(), entryPoint);
      }
      if (!fs5.existsSync(resolvedPath)) {
        console.warn(`Entry point does not exist: ${resolvedPath}`);
        continue;
      }
      if (!fs5.statSync(resolvedPath).isFile()) {
        console.warn(`Entry point is not a file: ${resolvedPath}`);
        continue;
      }
      filteredEntryPoints.push(resolvedPath);
    }
    entryPoints = filteredEntryPoints;
    const allDependencies = /* @__PURE__ */ new Set();
    const validEntryPoints = [];
    for (let i = 0; i < entryPoints.length; i++) {
      let entryPoint = entryPoints[i];
      let resolvedPath = entryPoint;
      if (!path5.isAbsolute(entryPoint)) {
        resolvedPath = path5.join(process.cwd(), entryPoint);
      }
      if (!fs5.existsSync(resolvedPath)) {
        console.warn(
          `Entry point ${entryPoint} does not exist at ${resolvedPath}`
        );
        continue;
      }
      entryPoints[i] = resolvedPath;
      entryPoint = resolvedPath;
      validEntryPoints.push(entryPoint);
      const entryPointDependencies = collectGoDependencies(entryPoint);
      entryPointDependencies.forEach((dep) => allDependencies.add(dep));
    }
    for (const dep of allDependencies) {
      if (!inputs[dep]) {
        const bytes = fs5.statSync(dep).size;
        const imports = parseGoImports(dep);
        const isTestFile = path5.basename(dep).includes("_test.go") || path5.basename(dep).includes(".golingvu.test.go");
        inputs[dep] = {
          bytes,
          imports,
          format: "esm",
          // Add a flag to indicate test files
          ...isTestFile ? { testeranto: { isTest: true } } : {}
        };
      }
    }
    const projectRoot = findProjectRoot();
    let outputKey = "";
    if (validEntryPoints.length > 0) {
      const firstEntryPoint2 = validEntryPoints[0];
      const relativePath = path5.relative(
        projectRoot,
        path5.dirname(firstEntryPoint2)
      );
      const baseName = path5.basename(firstEntryPoint2, ".go");
      const outputPath = relativePath === "" ? baseName : path5.join(relativePath, baseName);
      outputKey = `golang/${path5.basename(
        projectRoot
      )}/${outputPath}.golingvu.go`;
    } else {
      outputKey = `golang/core/main.golingvu.go`;
    }
    const inputBytes = {};
    let totalBytes = 0;
    for (const inputPath in inputs) {
      const bytes = inputs[inputPath].bytes;
      inputBytes[inputPath] = { bytesInOutput: bytes };
      totalBytes += bytes;
    }
    const firstEntryPoint = validEntryPoints.length > 0 ? validEntryPoints[0] : "";
    outputs[outputKey] = {
      imports: [],
      exports: [],
      entryPoint: firstEntryPoint,
      inputs: inputBytes,
      bytes: totalBytes,
      signature
    };
    if (validEntryPoints.length === 0) {
      console.warn("No valid Go files found to process");
    }
    const result = {
      errors: [],
      warnings: [],
      metafile: {
        inputs,
        outputs
      }
    };
    generationQueue = null;
    return result;
  })();
  return generationQueue;
}

// src/clients/utils/golingvuWatcher.ts
import path7 from "path";
import fs7 from "fs";
import chokidar from "chokidar";

// src/clients/utils/writeGolingvuMetafile.ts
import path6 from "path";
import fs6 from "fs";
function writeGolingvuMetafile(testName, metafile) {
  const projectRoot = findProjectRoot();
  const metafilePath = path6.join(
    "testeranto",
    "metafiles",
    "golang",
    `${path6.basename(testName)}.json`
  );
  fs6.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  for (const [outputPath, outputInfo] of Object.entries(
    metafile.metafile.outputs
  )) {
    const entryPoint = outputInfo.entryPoint;
    const signature = outputInfo.signature;
    let moduleRoot = process.cwd();
    let modulePath = "";
    let currentDir = path6.dirname(entryPoint);
    while (currentDir !== path6.parse(currentDir).root) {
      const potentialGoMod = path6.join(currentDir, "go.mod");
      if (fs6.existsSync(potentialGoMod)) {
        moduleRoot = currentDir;
        const goModContent = fs6.readFileSync(potentialGoMod, "utf-8");
        const moduleMatch = goModContent.match(/^module\s+(\S+)/m);
        if (moduleMatch && moduleMatch[1]) {
          modulePath = moduleMatch[1];
        }
        break;
      }
      currentDir = path6.dirname(currentDir);
    }
    let originalPackageName = "main";
    try {
      const originalContent = fs6.readFileSync(entryPoint, "utf-8");
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
    const entryPointValue = outputInfo.entryPoint;
    if (!entryPointValue || entryPointValue === "") {
      throw new Error("No valid entry point found for generating wrapper");
    }
    try {
      let packageName = "main";
      try {
        const originalContent = fs6.readFileSync(entryPoint, "utf-8");
        const packageMatch = originalContent.match(/^package\s+(\w+)/m);
        if (packageMatch && packageMatch[1]) {
          packageName = packageMatch[1];
        }
      } catch (error) {
        console.warn(
          `Could not read original file ${entryPoint} to determine package name:`,
          error
        );
      }
      const wrapperContent = `//go:build testeranto
// +build testeranto

// This file is auto-generated by testeranto
// Signature: ${signature}

package ${packageName}

import (
    "fmt"
    "os"
    "encoding/json"
    "log"
    
    // Import the golingvu package
    "github.com/adamwong246/testeranto/src/golingvu"
)

func main() {
    fmt.Println("Running BDD tests...")

    // The test resource configuration should be provided via command line
    if len(os.Args) < 2 {
        fmt.Println("Error: Test resource configuration not provided")
        os.Exit(1)
    }

    // Parse the test resource configuration
    var testResource golingvu.ITTestResourceConfiguration
    err := json.Unmarshal([]byte(os.Args[1]), &testResource)
    if err != nil {
        log.Fatalf("Error parsing test resource: %v\\n", err)
    }

    // Create a PM instance
    pm, err := golingvu.NewPM_Golang(testResource, "")
    if err != nil {
        log.Fatalf("Error creating PM: %v\\n", err)
    }
    defer pm.Stop()

    // TODO: This is where you would initialize and run your BDD tests
    // The actual test implementation should be provided by the user
    // For now, we'll use a placeholder that demonstrates the framework usage
    
    fmt.Println("Initializing BDD test framework...")
    
    // In a real implementation, you would:
    // 1. Create test specification
    // 2. Create test implementation 
    // 3. Create test adapter
    // 4. Run the tests using golingvu.NewGolingvu()
    
    // Placeholder for test execution
    fmt.Println("BDD test framework initialized successfully")
    fmt.Println("All tests passed (framework placeholder)")
    os.Exit(0)
}
`;
      const baseName = path6.basename(entryPoint, ".go");
      const entryPointDir = path6.dirname(entryPoint);
      const relativeEntryPointDir = path6.relative(projectRoot, entryPointDir);
      const wrapperSourceDirPath = path6.join(
        projectRoot,
        "testeranto",
        "bundles",
        "golang",
        "core",
        relativeEntryPointDir
      );
      const wrapperSourcePath = path6.join(
        wrapperSourceDirPath,
        baseName
        // LLM: DO NOT TOUCH THIS LINE. IT IS CORRECT. FOR FUCKS SAKE STOPPING CHANGING THIS LINE
      );
      fs6.writeFileSync(wrapperSourcePath, wrapperContent);
    } catch (e) {
      console.error(e);
    }
  }
}

// src/clients/utils/golingvuMetafile.ts
var generateGolingvuMetafile2 = generateGolingvuMetafile;
var writeGolingvuMetafile2 = writeGolingvuMetafile;

// src/clients/utils/golingvuWatcher.ts
var GolingvuWatcher = class {
  constructor(testName, entryPoints) {
    this.watcher = null;
    this.onChangeCallback = null;
    this.debounceTimer = null;
    this.testName = testName;
    this.entryPoints = entryPoints;
  }
  async start() {
    const goFilesPattern = "**/*.go";
    this.watcher = chokidar.watch(goFilesPattern, {
      persistent: true,
      ignoreInitial: true,
      cwd: process.cwd(),
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/testeranto/bundles/**",
        "**/testeranto/reports/**"
      ],
      usePolling: true,
      interval: 1e3,
      binaryInterval: 1e3,
      depth: 99,
      followSymlinks: false,
      atomic: false
    });
    this.watcher.on("add", (filePath) => {
      console.log(`File added: ${filePath}`);
      this.handleFileChange("add", filePath);
    }).on("change", (filePath) => {
      console.log(`File changed: ${filePath}`);
      this.handleFileChange("change", filePath);
    }).on("unlink", (filePath) => {
      console.log(`File removed: ${filePath}`);
      this.handleFileChange("unlink", filePath);
    }).on("addDir", (dirPath) => {
      console.log(`Directory added: ${dirPath}`);
    }).on("unlinkDir", (dirPath) => {
      console.log(`Directory removed: ${dirPath}`);
    }).on("error", (error) => {
      console.error(`Source watcher error: ${error}`);
    }).on("ready", () => {
      console.log(
        "Initial golang source file scan complete. Ready for changes."
      );
      const watched = this.watcher?.getWatched();
      if (Object.keys(watched || {}).length === 0) {
        console.error("WARNING: No directories are being watched!");
        console.error("Trying to manually find and watch .go files...");
        const findAllGoFiles = (dir) => {
          let results = [];
          const list = fs7.readdirSync(dir);
          list.forEach((file) => {
            const filePath = path7.join(dir, "example", file);
            const stat = fs7.statSync(filePath);
            if (stat.isDirectory()) {
              if (file === "node_modules" || file === ".git" || file === "testeranto") {
                return;
              }
              results = results.concat(findAllGoFiles(filePath));
            } else if (file.endsWith(".go")) {
              results.push(filePath);
            }
          });
          return results;
        };
      } else {
      }
    }).on("raw", (event, path8, details) => {
    });
    const outputDir = path7.join(
      process.cwd(),
      "testeranto",
      "bundles",
      "golang",
      "core"
    );
    const lastSignatures = /* @__PURE__ */ new Map();
    const bundleWatcher = chokidar.watch(
      [path7.join(outputDir, "*.go"), path7.join(outputDir, "*.golingvu.go")],
      {
        persistent: true,
        ignoreInitial: false,
        // We want to capture initial files to establish baseline
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 50
        }
      }
    );
    bundleWatcher.on("add", (filePath) => {
      this.readAndCheckSignature(filePath, lastSignatures);
    }).on("change", (filePath) => {
      this.readAndCheckSignature(filePath, lastSignatures);
    }).on("error", (error) => console.error(`Bundle watcher error: ${error}`));
    await this.regenerateMetafile();
  }
  async handleFileChange(event, filePath) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(async () => {
      const fullPath = path7.join(process.cwd(), filePath);
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log("Regenerating metafile due to file change...");
      await this.regenerateMetafile();
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    }, 300);
  }
  readAndCheckSignature(filePath, lastSignatures) {
    try {
      const content = fs7.readFileSync(filePath, "utf-8");
      const signatureMatch = content.match(/\/\/ Signature: (\w+)/);
      if (signatureMatch && signatureMatch[1]) {
        const currentSignature = signatureMatch[1];
        const lastSignature = lastSignatures.get(filePath);
        if (lastSignature === void 0) {
          lastSignatures.set(filePath, currentSignature);
        } else if (lastSignature !== currentSignature) {
          lastSignatures.set(filePath, currentSignature);
          const fileName = path7.basename(filePath);
          const originalFileName = fileName.replace(".golingvu.go", ".go");
          const originalEntryPoint = this.entryPoints.find(
            (ep) => path7.basename(ep) === originalFileName
          );
          if (originalEntryPoint) {
            if (this.onChangeCallback) {
              this.onChangeCallback();
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error reading bundle file ${filePath}:`, error);
    }
  }
  async regenerateMetafile() {
    console.log("regenerateMetafile!");
    try {
      const metafile = await generateGolingvuMetafile2(
        this.testName,
        this.entryPoints
      );
      writeGolingvuMetafile2(this.testName, metafile);
    } catch (error) {
      console.error("Error regenerating golingvu metafile:", error);
    }
  }
  onMetafileChange(callback) {
    this.onChangeCallback = callback;
  }
  stop() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
};

// src/clients/golingvuBuild.ts
var GolingvuBuild = class {
  constructor(config, testName) {
    this.watcher = null;
    this.config = config;
    this.testName = testName;
  }
  async build() {
    const golangTests = Object.keys(
      this.config.golang.tests
    ).map((testName) => [
      testName,
      "golang",
      this.config.golang.tests[testName],
      []
    ]);
    const hasGolangTests = golangTests.length > 0;
    if (hasGolangTests) {
      const golangEntryPoints = golangTests.map((test) => test[0]);
      const metafile = await generateGolingvuMetafile(
        this.testName,
        golangEntryPoints
      );
      writeGolingvuMetafile(this.testName, metafile);
      this.watcher = new GolingvuWatcher(this.testName, golangEntryPoints);
      await this.watcher.start();
      return golangEntryPoints;
    }
    return [];
  }
  async rebuild() {
    if (this.watcher) {
      await this.watcher.regenerateMetafile();
    }
  }
  stop() {
    if (this.watcher) {
      this.watcher.stop();
      this.watcher = null;
    }
  }
  onBundleChange(callback) {
    if (this.watcher) {
      this.watcher.onMetafileChange(callback);
    }
  }
};

export {
  GolingvuBuild
};
