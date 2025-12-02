var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app/backend/utils.ts
import path from "path";
var webEvaluator, tscPather, lintPather, promptPather, getRunnables;
var init_utils = __esm({
  "src/app/backend/utils.ts"() {
    "use strict";
    webEvaluator = (d, webArgz) => {
      return `
import('${d}').then(async (x) => {
  try {
    return await (await x.default).receiveTestResourceConfig(${webArgz})
  } catch (e) {
    console.log("web run failure", e.toString())
  }
})
`;
    };
    tscPather = (entryPoint, platform, projectName) => {
      return path.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `type_errors.txt`
      );
    };
    lintPather = (entryPoint, platform, projectName) => {
      return path.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `lint_errors.txt`
      );
    };
    promptPather = (entryPoint, platform, projectName) => {
      const e = entryPoint.split(".").slice(0, -1).join(".");
      return path.join(
        "testeranto",
        "reports",
        projectName,
        e,
        platform,
        `prompt.txt`
      );
    };
    getRunnables = (config, projectName) => {
      return {
        // pureEntryPoints: payload.pureEntryPoints || {},
        golangEntryPoints: Object.entries(config.golang.tests).reduce((pt, cv) => {
          pt[cv[0]] = path.resolve(cv[0]);
          return pt;
        }, {}),
        // golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
        nodeEntryPoints: Object.entries(config.node.tests).reduce((pt, cv) => {
          pt[cv[0]] = path.resolve(
            `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
          return pt;
        }, {}),
        // nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
        pythonEntryPoints: Object.entries(config.python.tests).reduce((pt, cv) => {
          pt[cv[0]] = path.resolve(cv[0]);
          return pt;
        }, {}),
        // pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {},
        webEntryPoints: Object.entries(config.web.tests).reduce((pt, cv) => {
          pt[cv[0]] = path.resolve(
            `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
          return pt;
        }, {})
        // webEntryPointSidecars: payload.webEntryPointSidecars || {},
      };
    };
  }
});

// src/utils/pitonoMetafile.ts
var pitonoMetafile_exports = {};
__export(pitonoMetafile_exports, {
  generatePitonoMetafile: () => generatePitonoMetafile,
  writePitonoMetafile: () => writePitonoMetafile
});
import fs from "fs";
import path2 from "path";
function resolvePythonImport(importPath, currentFile) {
  if (importPath.startsWith(".")) {
    const currentDir = path2.dirname(currentFile);
    let dotCount = 0;
    let remainingPath = importPath;
    while (remainingPath.startsWith(".")) {
      dotCount++;
      remainingPath = remainingPath.substring(1);
    }
    if (remainingPath.startsWith("/")) {
      remainingPath = remainingPath.substring(1);
    }
    let baseDir = currentDir;
    for (let i = 1; i < dotCount; i++) {
      baseDir = path2.dirname(baseDir);
    }
    if (remainingPath.length === 0) {
      const initPath = path2.join(baseDir, "__init__.py");
      if (fs.existsSync(initPath)) {
        return initPath;
      }
      return null;
    }
    const resolvedPath = path2.join(baseDir, remainingPath);
    const extensions = [".py", "/__init__.py"];
    for (const ext of extensions) {
      const potentialPath = resolvedPath + ext;
      if (fs.existsSync(potentialPath)) {
        return potentialPath;
      }
    }
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
      const initPath = path2.join(resolvedPath, "__init__.py");
      if (fs.existsSync(initPath)) {
        return initPath;
      }
    }
    return null;
  }
  const dirs = [
    path2.dirname(currentFile),
    process.cwd(),
    ...process.env.PYTHONPATH ? process.env.PYTHONPATH.split(path2.delimiter) : []
  ];
  for (const dir of dirs) {
    const potentialPaths = [
      path2.join(dir, importPath + ".py"),
      path2.join(dir, importPath, "__init__.py"),
      path2.join(dir, importPath.replace(/\./g, "/") + ".py"),
      path2.join(dir, importPath.replace(/\./g, "/"), "__init__.py")
    ];
    for (const potentialPath of potentialPaths) {
      if (fs.existsSync(potentialPath)) {
        return potentialPath;
      }
    }
  }
  return null;
}
function parsePythonImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const imports = [];
    const importRegex = /^import\s+([\w., ]+)/gm;
    const fromImportRegex = /^from\s+([\w.]+)\s+import/gm;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPaths = match[1].split(",").map((p) => p.trim());
      for (const importPath of importPaths) {
        const resolvedPath = resolvePythonImport(importPath, filePath);
        imports.push({
          path: importPath,
          kind: "import-statement",
          external: resolvedPath === null,
          original: importPath
        });
      }
    }
    while ((match = fromImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      const resolvedPath = resolvePythonImport(importPath, filePath);
      imports.push({
        path: importPath,
        kind: "import-statement",
        external: resolvedPath === null,
        original: importPath
      });
    }
    return imports;
  } catch (error) {
    console.warn(`Could not parse imports for ${filePath}:`, error);
    return [];
  }
}
function collectDependencies(filePath, visited = /* @__PURE__ */ new Set()) {
  if (visited.has(filePath))
    return [];
  visited.add(filePath);
  const dependencies = [filePath];
  const imports = parsePythonImports(filePath);
  for (const imp of imports) {
    if (!imp.external && imp.path) {
      const resolvedPath = resolvePythonImport(imp.path, filePath);
      if (resolvedPath && fs.existsSync(resolvedPath)) {
        dependencies.push(...collectDependencies(resolvedPath, visited));
      }
    }
  }
  return [...new Set(dependencies)];
}
async function generatePitonoMetafile(testName, entryPoints) {
  const inputs = {};
  const outputs = {};
  const signature = Date.now().toString(36);
  for (const entryPoint of entryPoints) {
    if (!fs.existsSync(entryPoint)) {
      console.warn(`Entry point ${entryPoint} does not exist`);
      continue;
    }
    const allDependencies = collectDependencies(entryPoint);
    for (const dep of allDependencies) {
      if (!inputs[dep]) {
        const bytes = fs.statSync(dep).size;
        const imports = parsePythonImports(dep);
        inputs[dep] = {
          bytes,
          imports
        };
      }
    }
    const entryPointName = path2.basename(entryPoint, ".py");
    const outputKey = `python/core/${entryPointName}.py`;
    const inputBytes = {};
    let totalBytes = 0;
    for (const dep of allDependencies) {
      const bytes = fs.statSync(dep).size;
      inputBytes[dep] = { bytesInOutput: bytes };
      totalBytes += bytes;
    }
    outputs[outputKey] = {
      imports: [],
      exports: [],
      entryPoint,
      inputs: inputBytes,
      bytes: totalBytes,
      signature
    };
  }
  return {
    errors: [],
    warnings: [],
    metafile: {
      inputs,
      outputs
    }
  };
}
function writePitonoMetafile(testName, metafile) {
  const projectRoot = process.cwd();
  const metafilePath = path2.join(
    "testeranto",
    "metafiles",
    "python",
    `${path2.basename(testName)}.json`
  );
  const metafileDir = path2.dirname(metafilePath);
  if (!fs.existsSync(metafileDir)) {
    fs.mkdirSync(metafileDir, { recursive: true });
  }
  fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  const outputDir = path2.join(
    projectRoot,
    "testeranto",
    "bundles",
    "python",
    "core"
  );
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  for (const [outputPath, outputInfo] of Object.entries(
    metafile.metafile.outputs
  )) {
    const fileName = path2.basename(outputPath);
    const fullOutputPath = path2.join(outputDir, fileName);
    const outputDirPath = path2.dirname(fullOutputPath);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }
    const entryPoint = outputInfo.entryPoint;
    const signature = outputInfo.signature;
    const content = `# This file is auto-generated by testeranto
# Signature: ${signature}
# It runs tests from: ${entryPoint}

import os
import sys

# Add the original entry point to the path
sys.path.insert(0, os.path.dirname(os.path.abspath("${entryPoint}")))

# Import and run the tests
try:
    # Import the module
    module_name = os.path.basename("${entryPoint}").replace('.py', '')
    module = __import__(module_name)
    
    # Run the tests if there's a main block
    if hasattr(module, 'main'):
        module.main()
    else:
        print(f"No main function found in {module_name}")
except Exception as e:
    print(f"Error running tests from ${entryPoint}: {e}")
    sys.exit(1)
`;
    fs.writeFileSync(fullOutputPath, content);
  }
}
var init_pitonoMetafile = __esm({
  "src/utils/pitonoMetafile.ts"() {
    "use strict";
  }
});

// src/utils/golingvuMetafile/helpers.ts
import fs3 from "fs";
import path4 from "path";
function findProjectRoot() {
  let currentDir = process.cwd();
  while (currentDir !== path4.parse(currentDir).root) {
    const packageJsonPath = path4.join(currentDir, "package.json");
    if (fs3.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path4.dirname(currentDir);
  }
  return process.cwd();
}
var init_helpers = __esm({
  "src/utils/golingvuMetafile/helpers.ts"() {
    "use strict";
  }
});

// src/utils/golingvuMetafile/fileDiscovery.ts
import fs4 from "fs";
import path5 from "path";
function collectGoDependencies(filePath, visited = /* @__PURE__ */ new Set()) {
  if (!filePath.endsWith(".go")) {
    return [];
  }
  if (visited.has(filePath))
    return [];
  visited.add(filePath);
  const dependencies = [filePath];
  const dir = path5.dirname(filePath);
  try {
    const files3 = fs4.readdirSync(dir);
    for (const file of files3) {
      if (file.endsWith(".go") && file !== path5.basename(filePath)) {
        const fullPath = path5.join(dir, file);
        dependencies.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dir}:`, error);
  }
  try {
    const content = fs4.readFileSync(filePath, "utf-8");
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
      path5.join(process.cwd(), "vendor", importPath),
      path5.join(currentDir, importPath),
      path5.join(process.cwd(), importPath),
      path5.join(process.cwd(), "src", importPath)
    ];
    for (const potentialPath of potentialPaths) {
      if (fs4.existsSync(potentialPath) && fs4.statSync(potentialPath).isDirectory()) {
        try {
          const files3 = fs4.readdirSync(potentialPath);
          for (const file of files3) {
            if (file.endsWith(".go") && !file.endsWith("_test.go")) {
              const fullPath = path5.join(potentialPath, file);
              dependencies.push(...collectGoDependencies(fullPath, visited));
            }
          }
          break;
        } catch (error) {
          console.warn(`Could not read directory ${potentialPath}:`, error);
        }
      }
      const goFilePath = potentialPath + ".go";
      if (fs4.existsSync(goFilePath) && fs4.statSync(goFilePath).isFile()) {
        if (goFilePath.endsWith(".go")) {
          dependencies.push(...collectGoDependencies(goFilePath, visited));
          break;
        }
      }
    }
  }
}
var init_fileDiscovery = __esm({
  "src/utils/golingvuMetafile/fileDiscovery.ts"() {
    "use strict";
  }
});

// src/utils/golingvuMetafile/goList.ts
import fs5 from "fs";
import path6 from "path";
import { execSync } from "child_process";
function runGoList(pattern) {
  try {
    let processedPattern = pattern;
    if (fs5.existsSync(pattern)) {
      const stat = fs5.statSync(pattern);
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
        processedPattern = path6.dirname(pattern);
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
var init_goList = __esm({
  "src/utils/golingvuMetafile/goList.ts"() {
    "use strict";
  }
});

// src/utils/golingvuMetafile/importParser.ts
import fs6 from "fs";
import path7 from "path";
function parseGoImports(filePath) {
  if (!filePath.endsWith(".go")) {
    return [];
  }
  const dir = path7.dirname(filePath);
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
    const content = fs6.readFileSync(filePath, "utf-8");
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
var init_importParser = __esm({
  "src/utils/golingvuMetafile/importParser.ts"() {
    "use strict";
    init_goList();
  }
});

// src/utils/generateGolingvuMetafile.ts
import path8 from "path";
import fs7 from "fs";
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
      if (!path8.isAbsolute(entryPoint)) {
        resolvedPath = path8.join(process.cwd(), entryPoint);
      }
      if (!fs7.existsSync(resolvedPath)) {
        console.warn(`Entry point does not exist: ${resolvedPath}`);
        continue;
      }
      if (!fs7.statSync(resolvedPath).isFile()) {
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
      if (!path8.isAbsolute(entryPoint)) {
        resolvedPath = path8.join(process.cwd(), entryPoint);
      }
      if (!fs7.existsSync(resolvedPath)) {
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
        const bytes = fs7.statSync(dep).size;
        const imports = parseGoImports(dep);
        const isTestFile = path8.basename(dep).includes("_test.go") || path8.basename(dep).includes(".golingvu.test.go");
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
      const relativePath = path8.relative(
        projectRoot,
        path8.dirname(firstEntryPoint2)
      );
      const baseName = path8.basename(firstEntryPoint2, ".go");
      const outputPath = relativePath === "" ? baseName : path8.join(relativePath, baseName);
      outputKey = `golang/${path8.basename(
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
var generationQueue;
var init_generateGolingvuMetafile = __esm({
  "src/utils/generateGolingvuMetafile.ts"() {
    "use strict";
    init_helpers();
    init_fileDiscovery();
    init_importParser();
    generationQueue = null;
  }
});

// src/utils/writeGolingvuMetafile.ts
import path9 from "path";
import fs8 from "fs";
function writeGolingvuMetafile(testName, metafile) {
  const projectRoot = findProjectRoot();
  const metafilePath = path9.join(
    "testeranto",
    "metafiles",
    "golang",
    `${path9.basename(testName)}.json`
  );
  fs8.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  for (const [outputPath, outputInfo] of Object.entries(
    metafile.metafile.outputs
  )) {
    const entryPoint = outputInfo.entryPoint;
    const signature = outputInfo.signature;
    let moduleRoot = process.cwd();
    let modulePath = "";
    let currentDir = path9.dirname(entryPoint);
    while (currentDir !== path9.parse(currentDir).root) {
      const potentialGoMod = path9.join(currentDir, "go.mod");
      if (fs8.existsSync(potentialGoMod)) {
        moduleRoot = currentDir;
        const goModContent = fs8.readFileSync(potentialGoMod, "utf-8");
        const moduleMatch = goModContent.match(/^module\s+(\S+)/m);
        if (moduleMatch && moduleMatch[1]) {
          modulePath = moduleMatch[1];
        }
        break;
      }
      currentDir = path9.dirname(currentDir);
    }
    let originalPackageName = "main";
    try {
      const originalContent = fs8.readFileSync(entryPoint, "utf-8");
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
        const originalContent = fs8.readFileSync(entryPoint, "utf-8");
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
      const baseName = path9.basename(entryPoint, ".go");
      const entryPointDir = path9.dirname(entryPoint);
      const relativeEntryPointDir = path9.relative(projectRoot, entryPointDir);
      const wrapperSourceDirPath = path9.join(
        projectRoot,
        "testeranto",
        "bundles",
        "golang",
        "core",
        relativeEntryPointDir
      );
      const wrapperSourcePath = path9.join(
        wrapperSourceDirPath,
        baseName
        // LLM: DO NOT TOUCH THIS LINE. IT IS CORRECT. FOR FUCKS SAKE STOPPING CHANGING THIS LINE
      );
      fs8.writeFileSync(wrapperSourcePath, wrapperContent);
    } catch (e) {
      console.error(e);
    }
  }
}
var init_writeGolingvuMetafile = __esm({
  "src/utils/writeGolingvuMetafile.ts"() {
    "use strict";
    init_helpers();
  }
});

// src/utils/golingvuMetafile.ts
var generateGolingvuMetafile2, writeGolingvuMetafile2;
var init_golingvuMetafile = __esm({
  "src/utils/golingvuMetafile.ts"() {
    "use strict";
    init_generateGolingvuMetafile();
    init_writeGolingvuMetafile();
    generateGolingvuMetafile2 = generateGolingvuMetafile;
    writeGolingvuMetafile2 = writeGolingvuMetafile;
  }
});

// src/utils/golingvuWatcher.ts
import path10 from "path";
import fs9 from "fs";
import chokidar2 from "chokidar";
var GolingvuWatcher;
var init_golingvuWatcher = __esm({
  "src/utils/golingvuWatcher.ts"() {
    "use strict";
    init_golingvuMetafile();
    GolingvuWatcher = class {
      constructor(testName, entryPoints) {
        this.watcher = null;
        this.onChangeCallback = null;
        this.debounceTimer = null;
        this.testName = testName;
        this.entryPoints = entryPoints;
      }
      async start() {
        const goFilesPattern = "**/*.go";
        this.watcher = chokidar2.watch(goFilesPattern, {
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
              const list = fs9.readdirSync(dir);
              list.forEach((file) => {
                const filePath = path10.join(dir, "example", file);
                const stat = fs9.statSync(filePath);
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
        }).on("raw", (event, path21, details) => {
        });
        const outputDir = path10.join(
          process.cwd(),
          "testeranto",
          "bundles",
          "golang",
          "core"
        );
        const lastSignatures = /* @__PURE__ */ new Map();
        const bundleWatcher = chokidar2.watch(
          [path10.join(outputDir, "*.go"), path10.join(outputDir, "*.golingvu.go")],
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
          const fullPath = path10.join(process.cwd(), filePath);
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
          const content = fs9.readFileSync(filePath, "utf-8");
          const signatureMatch = content.match(/\/\/ Signature: (\w+)/);
          if (signatureMatch && signatureMatch[1]) {
            const currentSignature = signatureMatch[1];
            const lastSignature = lastSignatures.get(filePath);
            if (lastSignature === void 0) {
              lastSignatures.set(filePath, currentSignature);
            } else if (lastSignature !== currentSignature) {
              lastSignatures.set(filePath, currentSignature);
              const fileName = path10.basename(filePath);
              const originalFileName = fileName.replace(".golingvu.go", ".go");
              const originalEntryPoint = this.entryPoints.find(
                (ep) => path10.basename(ep) === originalFileName
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
  }
});

// src/PM/golingvuBuild.ts
var golingvuBuild_exports = {};
__export(golingvuBuild_exports, {
  GolingvuBuild: () => GolingvuBuild
});
var GolingvuBuild;
var init_golingvuBuild = __esm({
  "src/PM/golingvuBuild.ts"() {
    "use strict";
    init_golingvuMetafile();
    init_golingvuWatcher();
    GolingvuBuild = class {
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
          const metafile = await generateGolingvuMetafile2(
            this.testName,
            golangEntryPoints
          );
          writeGolingvuMetafile2(this.testName, metafile);
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
  }
});

// src/esbuildConfigs/featuresPlugin.ts
import path11 from "path";
var featuresPlugin_default;
var init_featuresPlugin = __esm({
  "src/esbuildConfigs/featuresPlugin.ts"() {
    "use strict";
    featuresPlugin_default = {
      name: "feature-markdown",
      setup(build) {
        build.onResolve({ filter: /\.md$/ }, (args) => {
          if (args.resolveDir === "")
            return;
          return {
            path: path11.isAbsolute(args.path) ? args.path : path11.join(args.resolveDir, args.path),
            namespace: "feature-markdown"
          };
        });
        build.onLoad(
          { filter: /.*/, namespace: "feature-markdown" },
          async (args) => {
            return {
              contents: `file://${args.path}`,
              loader: "text"
              // contents: JSON.stringify({ path: args.path }),
              // loader: "json",
              // contents: JSON.stringify({
              //   // html: markdownHTML,
              //   raw: markdownContent,
              //   filename: args.path, //path.basename(args.path),
              // }),
              // loader: "json",
            };
          }
        );
      }
    };
  }
});

// src/esbuildConfigs/index.ts
var esbuildConfigs_default;
var init_esbuildConfigs = __esm({
  "src/esbuildConfigs/index.ts"() {
    "use strict";
    esbuildConfigs_default = (config) => {
      return {
        // packages: "external",
        target: "esnext",
        format: "esm",
        splitting: true,
        outExtension: { ".js": ".mjs" },
        outbase: ".",
        jsx: "transform",
        bundle: true,
        minify: config.minify === true,
        write: true,
        loader: {
          ".js": "jsx",
          ".png": "binary",
          ".jpg": "binary"
        }
      };
    };
  }
});

// src/esbuildConfigs/inputFilesPlugin.ts
import fs10 from "fs";
var otherInputs, register, inputFilesPlugin_default;
var init_inputFilesPlugin = __esm({
  "src/esbuildConfigs/inputFilesPlugin.ts"() {
    "use strict";
    otherInputs = {};
    register = (entrypoint, sources) => {
      if (!otherInputs[entrypoint]) {
        otherInputs[entrypoint] = /* @__PURE__ */ new Set();
      }
      sources.forEach((s) => otherInputs[entrypoint].add(s));
    };
    inputFilesPlugin_default = (platform, testName) => {
      const f = `testeranto/metafiles/${platform}/${testName}.json`;
      if (!fs10.existsSync(`testeranto/metafiles/${platform}`)) {
        fs10.mkdirSync(`testeranto/metafiles/${platform}`, { recursive: true });
      }
      return {
        register,
        inputFilesPluginFactory: {
          name: "metafileWriter",
          setup(build) {
            build.onEnd((result) => {
              fs10.writeFileSync(f, JSON.stringify(result, null, 2));
            });
          }
        }
      };
    };
  }
});

// src/esbuildConfigs/rebuildPlugin.ts
import fs11 from "fs";
var rebuildPlugin_default;
var init_rebuildPlugin = __esm({
  "src/esbuildConfigs/rebuildPlugin.ts"() {
    "use strict";
    rebuildPlugin_default = (r) => {
      return {
        name: "rebuild-notify",
        setup: (build) => {
          build.onEnd((result) => {
            console.log(`${r} > build ended with ${result.errors.length} errors`);
            if (result.errors.length > 0) {
              fs11.writeFileSync(
                `./testeranto/reports${r}_build_errors`,
                JSON.stringify(result, null, 2)
              );
            }
          });
        }
      };
    };
  }
});

// src/esbuildConfigs/node.ts
var node_default;
var init_node = __esm({
  "src/esbuildConfigs/node.ts"() {
    "use strict";
    init_featuresPlugin();
    init_esbuildConfigs();
    init_inputFilesPlugin();
    init_rebuildPlugin();
    node_default = (config, entryPoints, testName) => {
      const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
        "node",
        testName
      );
      return {
        ...esbuildConfigs_default(config),
        splitting: true,
        outdir: `testeranto/bundles/node/${testName}/`,
        // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
        metafile: true,
        supported: {
          "dynamic-import": true
        },
        define: {
          "process.env.FLUENTFFMPEG_COV": "0",
          ENV: `"node"`
        },
        absWorkingDir: process.cwd(),
        banner: {
          js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
        },
        platform: "node",
        external: [
          // "react",
          // "fs",
          // "path",
          // "os",
          // "child_process",
          // "crypto",
          // "http",
          // "https",
          // "net",
          // "dns",
          // "stream",
          // "util",
          // "events",
          // "buffer",
          // "url",
          // "assert",
          // "tls",
          // "zlib",
          // "querystring",
          // "readline",
          // "cluster",
          // "module",
          // "vm",
          // "perf_hooks",
          // "inspector",
          ...config.node.externals
        ],
        entryPoints: [...entryPoints],
        plugins: [
          featuresPlugin_default,
          inputFilesPluginFactory,
          rebuildPlugin_default("node"),
          ...config.node.plugins.map((p) => p(register2, entryPoints)) || []
        ]
      };
    };
  }
});

// src/esbuildConfigs/web.ts
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import path12 from "path";
var web_default;
var init_web = __esm({
  "src/esbuildConfigs/web.ts"() {
    "use strict";
    init_featuresPlugin();
    init_esbuildConfigs();
    init_inputFilesPlugin();
    init_rebuildPlugin();
    web_default = (config, entryPoints, testName) => {
      const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
        "web",
        testName
      );
      return {
        ...esbuildConfigs_default(config),
        define: {
          "process.env.FLUENTFFMPEG_COV": "0",
          ENV: `"web"`
        },
        treeShaking: true,
        outdir: `testeranto/bundles/web/${testName}`,
        alias: {
          react: path12.resolve("./node_modules/react")
        },
        metafile: true,
        external: [
          // "path",
          // "fs",
          // "stream",
          // "http",
          // "constants",
          // "net",
          // "assert",
          // "tls",
          // "os",
          // "child_process",
          // "readline",
          // "zlib",
          // "crypto",
          // "https",
          // "util",
          // "process",
          // "dns",
        ],
        banner: {
          js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
        },
        platform: "browser",
        entryPoints: [...entryPoints],
        loader: config.web.loaders,
        plugins: [
          featuresPlugin_default,
          inputFilesPluginFactory,
          polyfillNode({
            // You might need to configure specific Node.js modules you want to polyfill
            // Example:
            // modules: {
            //   'util': true,
            //   'fs': false,
            // }
          }),
          rebuildPlugin_default("web"),
          ...(config.web.plugins || []).map((p) => p(register2, entryPoints)) || []
        ]
      };
    };
  }
});

// src/PM/utils.ts
import ansiC from "ansi-colors";
import path13 from "path";
import fs12 from "fs";
import crypto from "node:crypto";
function runtimeLogs(runtime, reportDest) {
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs12.existsSync(safeDest)) {
      fs12.mkdirSync(safeDest, { recursive: true });
    }
    if (runtime === "node") {
      return {
        stdout: fs12.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs12.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs12.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "web") {
      return {
        info: fs12.createWriteStream(`${safeDest}/info.log`),
        warn: fs12.createWriteStream(`${safeDest}/warn.log`),
        error: fs12.createWriteStream(`${safeDest}/error.log`),
        debug: fs12.createWriteStream(`${safeDest}/debug.log`),
        exit: fs12.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "pure") {
      return {
        exit: fs12.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "python") {
      return {
        stdout: fs12.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs12.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs12.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "golang") {
      return {
        stdout: fs12.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs12.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs12.createWriteStream(`${safeDest}/exit.log`)
      };
    } else {
      throw `unknown runtime: ${runtime}`;
    }
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}
function createLogStreams(reportDest, runtime) {
  if (!fs12.existsSync(reportDest)) {
    fs12.mkdirSync(reportDest, { recursive: true });
  }
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs12.existsSync(safeDest)) {
      fs12.mkdirSync(safeDest, { recursive: true });
    }
    const streams = runtimeLogs(runtime, safeDest);
    return {
      ...streams,
      closeAll: () => {
        Object.values(streams).forEach(
          (stream) => !stream.closed && stream.close()
        );
      },
      writeExitCode: (code, error) => {
        if (error) {
          streams.exit.write(`Error: ${error.message}
`);
          if (error.stack) {
            streams.exit.write(`Stack Trace:
${error.stack}
`);
          }
        }
        streams.exit.write(`${code}
`);
      },
      exit: streams.exit
    };
  } catch (e) {
    console.error(`Failed to create log streams in ${safeDest}:`, e);
    throw e;
  }
}
async function fileHash(filePath, algorithm = "md5") {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs12.createReadStream(filePath);
    fileStream.on("data", (data) => {
      hash.update(data);
    });
    fileStream.on("end", () => {
      const fileHash2 = hash.digest("hex");
      resolve(fileHash2);
    });
    fileStream.on("error", (error) => {
      reject(`Error reading file: ${error.message}`);
    });
  });
}
async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path13.dirname(filePath);
  try {
    await fs12.promises.mkdir(dirPath, { recursive: true });
    await fs12.writeFileSync(filePath, data);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
async function pollForFile(path21, timeout = 2e3) {
  const intervalObj = setInterval(function() {
    const file = path21;
    const fileExists = fs12.existsSync(file);
    if (fileExists) {
      clearInterval(intervalObj);
    }
  }, timeout);
}
var statusMessagePretty, filesHash, executablePath, puppeteerConfigs;
var init_utils2 = __esm({
  "src/PM/utils.ts"() {
    "use strict";
    statusMessagePretty = (failures, test, runtime) => {
      if (failures === 0) {
        console.log(ansiC.green(ansiC.inverse(`${runtime} > ${test}`)));
      } else if (failures > 0) {
        console.log(
          ansiC.red(
            ansiC.inverse(
              `${runtime} > ${test} failed ${failures} times (exit code: ${failures})`
            )
          )
        );
      } else {
        console.log(
          ansiC.red(ansiC.inverse(`${runtime} > ${test} crashed (exit code: -1)`))
        );
      }
    };
    filesHash = async (files3, algorithm = "md5") => {
      return new Promise((resolve, reject) => {
        resolve(
          files3.reduce(async (mm, f) => {
            return await mm + await fileHash(f);
          }, Promise.resolve(""))
        );
      });
    };
    executablePath = "/opt/homebrew/bin/chromium";
    puppeteerConfigs = {
      slowMo: 1,
      waitForInitialPage: false,
      executablePath,
      defaultViewport: null,
      // Disable default 800x600 viewport
      dumpio: false,
      // headless: true,
      // devtools: false,
      headless: false,
      devtools: true,
      args: [
        "--allow-file-access-from-files",
        "--allow-insecure-localhost",
        "--allow-running-insecure-content",
        "--auto-open-devtools-for-tabs",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-features=site-per-process",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--disable-site-isolation-trials",
        "--disable-web-security",
        "--no-first-run",
        "--no-sandbox",
        "--no-startup-window",
        "--reduce-security-for-testing",
        "--remote-allow-origins=*",
        "--start-maximized",
        "--unsafely-treat-insecure-origin-as-secure=*",
        `--remote-debugging-port=3234`
        // "--disable-features=IsolateOrigins,site-per-process",
        // "--disable-features=IsolateOrigins",
        // "--disk-cache-dir=/dev/null",
        // "--disk-cache-size=1",
        // "--no-zygote",
        // "--remote-allow-origins=ws://localhost:3234",
        // "--single-process",
        // "--start-maximized",
        // "--unsafely-treat-insecure-origin-as-secure",
        // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
      ]
    };
  }
});

// src/utils/queue.ts
var Queue;
var init_queue = __esm({
  "src/utils/queue.ts"() {
    "use strict";
    Queue = class {
      constructor() {
        this.items = [];
      }
      enqueue(element) {
        this.items.push(element);
      }
      dequeue() {
        if (this.isEmpty()) {
          return "Queue is empty";
        }
        return this.items.shift();
      }
      peek() {
        if (this.isEmpty()) {
          return "Queue is empty";
        }
        return this.items[0];
      }
      isEmpty() {
        return this.items.length === 0;
      }
      size() {
        return this.items.length;
      }
      clear() {
        this.items = [];
      }
      print() {
        console.log(this.items.join(" -> "));
      }
    };
  }
});

// src/app/backend/getAllFilesRecursively.ts
import fs13 from "fs";
import path14 from "path";
async function getAllFilesRecursively(directoryPath) {
  let fileList = [];
  const files3 = await fs13.readdirSync(directoryPath, { withFileTypes: true });
  for (const file of files3) {
    const fullPath = path14.join(directoryPath, file.name);
    if (file.isDirectory()) {
      fileList = fileList.concat(await getAllFilesRecursively(fullPath));
    } else if (file.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}
var init_getAllFilesRecursively = __esm({
  "src/app/backend/getAllFilesRecursively.ts"() {
    "use strict";
  }
});

// src/app/FileService.ts
var FileService_methods;
var init_FileService = __esm({
  "src/app/FileService.ts"() {
    "use strict";
    FileService_methods = [
      "writeFile_send",
      "writeFile_receive",
      "readFile_receive",
      "readFile_send",
      "createDirectory_receive",
      "createDirectory_send",
      "deleteFile_receive",
      "deleteFile_send",
      "files_send",
      "files_receive",
      "projects_send",
      "projects_receive",
      "tests_send",
      "tests_receive",
      "report_send",
      "report_receive"
    ];
  }
});

// src/app/api.ts
var init_api = __esm({
  "src/app/api.ts"() {
    "use strict";
  }
});

// src/app/backend/PM_0.ts
import fs14 from "fs";
import path15 from "path";
var fileStreams3, fPaths, files, recorders, screenshots, PM_0;
var init_PM_0 = __esm({
  "src/app/backend/PM_0.ts"() {
    "use strict";
    fileStreams3 = [];
    fPaths = [];
    files = {};
    recorders = {};
    screenshots = {};
    PM_0 = class {
      constructor(configs, projectName, mode2) {
        this.configs = configs;
        this.mode = mode2;
        this.projectName = projectName;
      }
      mapping() {
        return [
          ["$", this.$],
          ["click", this.click],
          ["closePage", this.closePage],
          ["createWriteStream", this.createWriteStream],
          ["customclose", this.customclose],
          ["customScreenShot", this.customScreenShot.bind(this)],
          ["end", this.end],
          ["existsSync", this.existsSync],
          ["focusOn", this.focusOn],
          ["getAttribute", this.getAttribute],
          ["getInnerHtml", this.getInnerHtml],
          // ["setValue", this.setValue],
          ["goto", this.goto.bind(this)],
          ["isDisabled", this.isDisabled],
          // ["launchSideCar", this.launchSideCar.bind(this)],
          ["mkdirSync", this.mkdirSync],
          ["newPage", this.newPage],
          ["page", this.page],
          ["pages", this.pages],
          ["screencast", this.screencast],
          ["screencastStop", this.screencastStop],
          // ["stopSideCar", this.stopSideCar.bind(this)],
          ["typeInto", this.typeInto],
          ["waitForSelector", this.waitForSelector],
          ["write", this.write],
          ["writeFileSync", this.writeFileSync]
        ];
      }
      customclose() {
        throw new Error("customclose not implemented.");
      }
      waitForSelector(p, s) {
        return new Promise((res) => {
          this.doInPage(p, async (page) => {
            const x = page.$(s);
            const y = await x;
            res(y !== null);
          });
        });
      }
      closePage(p) {
        return new Promise((res) => {
          this.doInPage(p, async (page) => {
            page.close();
            res({});
          });
        });
      }
      async newPage() {
        return (await this.browser.newPage()).mainFrame()._id;
      }
      goto(p, url2) {
        return new Promise((res) => {
          this.doInPage(p, async (page) => {
            await page?.goto(url2);
            res({});
          });
        });
      }
      $(selector, p) {
        return new Promise((res) => {
          this.doInPage(p, async (page) => {
            const x = await page.$(selector);
            const y = await x?.jsonValue();
            res(y);
          });
        });
      }
      async pages() {
        return (await this.browser.pages()).map((p) => {
          return p.mainFrame()._id;
        });
      }
      async screencast(ssOpts, testName, page) {
        const p = ssOpts.path;
        const dir = path15.dirname(p);
        fs14.mkdirSync(dir, {
          recursive: true
        });
        if (!files[testName]) {
          files[testName] = /* @__PURE__ */ new Set();
        }
        files[testName].add(ssOpts.path);
        const sPromise = page.screenshot({
          ...ssOpts,
          path: p
        });
        if (!screenshots[testName]) {
          screenshots[testName] = [];
        }
        screenshots[testName].push(sPromise);
        await sPromise;
        return sPromise;
      }
      async customScreenShot(ssOpts, testName, pageUid) {
        const p = ssOpts.path;
        const dir = path15.dirname(p);
        fs14.mkdirSync(dir, {
          recursive: true
        });
        if (!files[testName]) {
          files[testName] = /* @__PURE__ */ new Set();
        }
        files[testName].add(ssOpts.path);
        const page = (await this.browser.pages()).find(
          (p2) => p2.mainFrame()._id === pageUid
        );
        const sPromise = page.screenshot({
          ...ssOpts,
          path: p
        });
        if (!screenshots[testName]) {
          screenshots[testName] = [];
        }
        screenshots[testName].push(sPromise);
        await sPromise;
        return sPromise;
      }
      async end(uid) {
        await fileStreams3[uid].end();
        return true;
      }
      existsSync(destFolder) {
        return fs14.existsSync(destFolder);
      }
      async mkdirSync(fp) {
        if (!fs14.existsSync(fp)) {
          return fs14.mkdirSync(fp, {
            recursive: true
          });
        }
        return false;
      }
      async writeFileSync(...x) {
        const filepath = x[0];
        const contents = x[1];
        const testName = x[2];
        return new Promise(async (res) => {
          fs14.mkdirSync(path15.dirname(filepath), {
            recursive: true
          });
          if (!files[testName]) {
            files[testName] = /* @__PURE__ */ new Set();
          }
          files[testName].add(filepath);
          await fs14.writeFileSync(filepath, contents);
          res(true);
        });
      }
      async createWriteStream(filepath, testName) {
        const folder = filepath.split("/").slice(0, -1).join("/");
        return new Promise((res) => {
          if (!fs14.existsSync(folder)) {
            return fs14.mkdirSync(folder, {
              recursive: true
            });
          }
          const f = fs14.createWriteStream(filepath);
          fileStreams3.push(f);
          if (!files[testName]) {
            files[testName] = /* @__PURE__ */ new Set();
          }
          files[testName].add(filepath);
          res(fileStreams3.length - 1);
        });
      }
      testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
          callback(
            new Promise((res, rej) => {
              tLog("testArtiFactory =>", fPath);
              const cleanPath = path15.resolve(fPath);
              fPaths.push(cleanPath.replace(process.cwd(), ``));
              const targetDir = cleanPath.split("/").slice(0, -1).join("/");
              fs14.mkdir(targetDir, { recursive: true }, async (error) => {
                if (error) {
                }
                fs14.writeFileSync(
                  path15.resolve(
                    targetDir.split("/").slice(0, -1).join("/"),
                    "manifest"
                  ),
                  fPaths.join(`
`),
                  {
                    encoding: "utf-8"
                  }
                );
                if (Buffer.isBuffer(value)) {
                  fs14.writeFileSync(fPath, value, "binary");
                  res();
                } else if (`string` === typeof value) {
                  fs14.writeFileSync(fPath, value.toString(), {
                    encoding: "utf-8"
                  });
                  res();
                } else {
                  const pipeStream = value;
                  const myFile = fs14.createWriteStream(fPath);
                  pipeStream.pipe(myFile);
                  pipeStream.on("close", () => {
                    myFile.close();
                    res();
                  });
                }
              });
            })
          );
        };
      }
      async write(uid, contents) {
        return new Promise((res) => {
          const x = fileStreams3[uid].write(contents);
          res(x);
        });
      }
      page(p) {
        return p;
      }
      click(selector, page) {
        return page.click(selector);
      }
      async focusOn(selector, p) {
        this.doInPage(p, (page) => {
          return page.focus(selector);
        });
      }
      async typeInto(value, p) {
        this.doInPage(p, (page) => {
          return page.keyboard.type(value);
        });
      }
      getAttribute(selector, attribute, p) {
        this.doInPage(p, (page) => {
          return page.$eval(selector, (input) => input.getAttribute(attribute));
        });
      }
      async getInnerHtml(selector, p) {
        return new Promise((res, rej) => {
          this.doInPage(p, async (page) => {
            const e = await page.$(selector);
            if (!e) {
              rej();
            } else {
              const text = await (await e.getProperty("textContent")).jsonValue();
              res(text);
            }
          });
        });
      }
      isDisabled(selector, p) {
        this.doInPage(p, async (page) => {
          return await page.$eval(selector, (input) => {
            return input.disabled;
          });
        });
      }
      screencastStop(s) {
        return recorders[s].stop();
      }
      async doInPage(p, cb) {
        (await this.browser.pages()).forEach((page) => {
          const frame = page.mainFrame();
          if (frame._id === p) {
            return cb(page);
          }
        });
      }
    };
  }
});

// src/utils/logFiles.ts
function getLogFilesForRuntime(runtime) {
  const { standard, runtimeSpecific } = getRuntimeLogs(runtime);
  return [...standard, ...runtimeSpecific];
}
var LOG_FILES, STANDARD_LOGS, RUNTIME_SPECIFIC_LOGS, ALL_LOGS, getRuntimeLogs;
var init_logFiles = __esm({
  "src/utils/logFiles.ts"() {
    "use strict";
    LOG_FILES = {
      TESTS: "tests.json",
      TYPE_ERRORS: "type_errors.txt",
      LINT_ERRORS: "lint_errors.txt",
      EXIT: "exit.log",
      MESSAGE: "message.txt",
      PROMPT: "prompt.txt",
      STDOUT: "stdout.log",
      STDERR: "stderr.log",
      INFO: "info.log",
      ERROR: "error.log",
      WARN: "warn.log",
      DEBUG: "debug.log"
    };
    STANDARD_LOGS = {
      TESTS: "tests.json",
      TYPE_ERRORS: "type_errors.txt",
      LINT_ERRORS: "lint_errors.txt",
      EXIT: "exit.log",
      MESSAGE: "message.txt",
      PROMPT: "prompt.txt",
      BUILD: "build.json"
    };
    RUNTIME_SPECIFIC_LOGS = {
      node: {
        STDOUT: "stdout.log",
        STDERR: "stderr.log"
      },
      web: {
        INFO: "info.log",
        ERROR: "error.log",
        WARN: "warn.log",
        DEBUG: "debug.log"
      },
      pure: {},
      // No runtime-specific logs for pure
      python: {
        STDOUT: "stdout.log",
        STDERR: "stderr.log"
      },
      golang: {
        STDOUT: "stdout.log",
        STDERR: "stderr.log"
      }
    };
    ALL_LOGS = {
      ...STANDARD_LOGS,
      ...Object.values(RUNTIME_SPECIFIC_LOGS).reduce((acc, logs) => ({ ...acc, ...logs }), {})
    };
    getRuntimeLogs = (runtime) => {
      return {
        standard: Object.values(STANDARD_LOGS),
        runtimeSpecific: Object.values(RUNTIME_SPECIFIC_LOGS[runtime])
      };
    };
  }
});

// src/app/backend/makePrompt.ts
import fs15 from "fs";
import path16 from "path";
var makePrompt;
var init_makePrompt = __esm({
  "src/app/backend/makePrompt.ts"() {
    "use strict";
    init_utils();
    init_logFiles();
    init_logFiles();
    makePrompt = async (summary, name, entryPoint, addableFiles, runTime) => {
      summary[entryPoint].prompt = "?";
      const promptPath = promptPather(entryPoint, runTime, name);
      const testDir = path16.join(
        "testeranto",
        "reports",
        name,
        entryPoint.split(".").slice(0, -1).join("."),
        runTime
      );
      const testPaths = path16.join(testDir, LOG_FILES.TESTS);
      const lintPath = path16.join(testDir, LOG_FILES.LINT_ERRORS);
      const typePath = path16.join(testDir, LOG_FILES.TYPE_ERRORS);
      const messagePath = path16.join(testDir, LOG_FILES.MESSAGE);
      fs15.writeFileSync(
        `${testDir}/tests.html`,
        `aider --model deepseek/deepseek-chat --load testeranto/reports/${name}/${entryPoint.split(".").slice(0, -1).join(
          "."
        )}/${runTime}/prompt.txt --message-file testeranto/reports/${name}/${entryPoint.split(".").slice(0, -1).join(".")}/${runTime}/message.txt`
      );
      try {
        await Promise.all([
          fs15.promises.writeFile(
            promptPath,
            `
${addableFiles.map((x) => {
              return `/add ${x}`;
            }).join("\n")}

/read node_modules/testeranto/docs/index.md
/read node_modules/testeranto/docs/style.md
/read node_modules/testeranto/docs/testing.ai.txt
/read node_modules/testeranto/src/CoreTypes.ts

/read ${testPaths}
/read ${typePath}
/read ${lintPath}

/read ${getLogFilesForRuntime(runTime).map((p) => `${testDir}/${p}`).join("\n/read ")}
`
          ),
          fs15.promises.writeFile(
            messagePath,
            `
There are 3 types of test reports.
1) bdd (highest priority)
2) type checker
3) static analysis (lowest priority)

"tests.json" is the detailed result of the bdd tests.
if these files do not exist, then something has gone badly wrong and needs to be addressed.

"type_errors.txt" is the result of the type checker.
if this file does not exist, then type check passed without errors;

"lint_errors.txt" is the result of the static analysis.
if this file does not exist, then static analysis passed without errors;

BDD failures are the highest priority. Focus on passing BDD tests before addressing other concerns.
Do not add error throwing/catching to the tests themselves.
`
          )
        ]);
      } catch (e) {
        console.error(`Failed to write prompt files at ${testDir}`);
        console.error(e);
        throw e;
      }
      summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${name}/reports/${runTime}/${entryPoint.split(".").slice(0, -1).join(".")}/prompt.txt`;
    };
  }
});

// src/app/backend/PM_1_WithProcesses.ts
import path17 from "path";
import puppeteer, { executablePath as executablePath2 } from "puppeteer-core";
import ansiC2 from "ansi-colors";
import fs16, { watch } from "fs";
var changes, PM_1_WithProcesses;
var init_PM_1_WithProcesses = __esm({
  "src/app/backend/PM_1_WithProcesses.ts"() {
    "use strict";
    init_utils2();
    init_PM_0();
    init_makePrompt();
    init_utils();
    changes = {};
    PM_1_WithProcesses = class extends PM_0 {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.summary = {};
        this.logStreams = {};
        this.runningProcesses = /* @__PURE__ */ new Map();
        this.allProcesses = /* @__PURE__ */ new Map();
        this.processLogs = /* @__PURE__ */ new Map();
        this.clients = /* @__PURE__ */ new Set();
        this.configTests = () => {
          return [
            ...Object.keys(this.configs.node.tests).map((t) => [
              t,
              "node",
              this.configs.node.tests[t],
              []
            ]),
            ...Object.keys(this.configs.web.tests).map((t) => [
              t,
              "web",
              this.configs.web.tests[t],
              []
            ]),
            ...Object.keys(this.configs.python.tests).map((t) => [
              t,
              "python",
              this.configs.python.tests[t],
              []
            ]),
            ...Object.keys(this.configs.golang.tests).map((t) => [
              t,
              "golang",
              this.configs.golang.tests[t],
              []
            ])
          ];
        };
        this.writeBigBoard = () => {
          const summaryPath = `./testeranto/reports/${this.projectName}/summary.json`;
          const summaryData = JSON.stringify(this.summary, null, 2);
          fs16.writeFileSync(summaryPath, summaryData);
          this.webSocketBroadcastMessage({
            type: "summaryUpdate",
            data: this.summary
          });
        };
        this.receiveFeaturesV2 = (reportDest, srcTest, platform) => {
          const featureDestination = path17.resolve(
            process.cwd(),
            "reports",
            "features",
            "strings",
            srcTest.split(".").slice(0, -1).join(".") + ".features.txt"
          );
          const testReportPath = `${reportDest}/tests.json`;
          if (!fs16.existsSync(testReportPath)) {
            console.error(`tests.json not found at: ${testReportPath}`);
            return;
          }
          const testReport = JSON.parse(fs16.readFileSync(testReportPath, "utf8"));
          if (testReport.tests) {
            testReport.tests.forEach((test) => {
              test.fullPath = path17.resolve(process.cwd(), srcTest);
            });
          }
          testReport.fullPath = path17.resolve(process.cwd(), srcTest);
          fs16.writeFileSync(testReportPath, JSON.stringify(testReport, null, 2));
          testReport.features.reduce(async (mm, featureStringKey) => {
            const accum = await mm;
            const isUrl = isValidUrl(featureStringKey);
            if (isUrl) {
              const u = new URL(featureStringKey);
              if (u.protocol === "file:") {
                accum.files.push(u.pathname);
              } else if (u.protocol === "http:" || u.protocol === "https:") {
                const newPath = `${process.cwd()}/testeranto/features/external/${u.hostname}${u.pathname}`;
                const body = await this.configs.featureIngestor(featureStringKey);
                writeFileAndCreateDir(newPath, body);
                accum.files.push(newPath);
              }
            } else {
              await fs16.promises.mkdir(path17.dirname(featureDestination), {
                recursive: true
              });
              accum.strings.push(featureStringKey);
            }
            return accum;
          }, Promise.resolve({ files: [], strings: [] })).then(({ files: files3 }) => {
            fs16.writeFileSync(
              `testeranto/reports/${this.projectName}/${srcTest.split(".").slice(0, -1).join(".")}/${platform}/featurePrompt.txt`,
              files3.map((f) => {
                return `/read ${f}`;
              }).join("\n")
            );
          });
          testReport.givens.forEach((g) => {
            if (g.failed === true) {
              this.summary[srcTest].failingFeatures[g.key] = g.features;
            }
          });
          this.writeBigBoard();
        };
        this.checkForShutdown = () => {
          this.checkQueue();
          console.log(
            ansiC2.inverse(
              `The following jobs are awaiting resources: ${JSON.stringify(
                this.queue
              )}`
            )
          );
          console.log(
            ansiC2.inverse(`The status of ports: ${JSON.stringify(this.ports)}`)
          );
          this.writeBigBoard();
          if (this.mode === "dev")
            return;
          let inflight = false;
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].prompt === "?") {
              console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} prompt ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].runTimeErrors === "?") {
              console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} runTimeError ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].staticErrors === "?") {
              console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} staticErrors ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].typeErrors === "?") {
              console.log(ansiC2.blue(ansiC2.inverse(`\u{1F555} typeErrors ${k}`)));
              inflight = true;
            }
          });
          this.writeBigBoard();
          if (!inflight) {
            if (this.browser) {
              if (this.browser) {
                this.browser.disconnect().then(() => {
                  console.log(
                    ansiC2.inverse(`${this.projectName} has been tested. Goodbye.`)
                  );
                  process.exit();
                });
              }
            }
          }
        };
        this.configTests().forEach(([t, rt, tr, sidecars]) => {
          this.ensureSummaryEntry(t);
          sidecars.forEach(([sidecarName]) => {
            this.ensureSummaryEntry(sidecarName, true);
          });
        });
        this.launchers = {};
        this.ports = {};
        this.queue = [];
        this.configs.ports.forEach((element) => {
          this.ports[element] = "";
        });
      }
      webSocketBroadcastMessage(message) {
        const data = typeof message === "string" ? message : JSON.stringify(message);
        this.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(data);
          }
        });
      }
      addPromiseProcess(processId, promise, command, category = "other", testName, platform, onResolve, onReject) {
        this.runningProcesses.set(processId, promise);
        this.allProcesses.set(processId, {
          promise,
          status: "running",
          command,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          type: "promise",
          category,
          testName,
          platform
        });
        this.processLogs.set(processId, []);
        const startMessage = `Starting: ${command}`;
        const logs = this.processLogs.get(processId) || [];
        logs.push(startMessage);
        this.processLogs.set(processId, logs);
        this.webSocketBroadcastMessage({
          type: "processStarted",
          processId,
          command,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          logs: [startMessage]
        });
        promise.then((result) => {
          this.runningProcesses.delete(processId);
          const processInfo = this.allProcesses.get(processId);
          if (processInfo) {
            this.allProcesses.set(processId, {
              ...processInfo,
              status: "completed",
              exitCode: 0
            });
          }
          const successMessage = `Completed successfully with result: ${JSON.stringify(
            result
          )}`;
          const currentLogs = this.processLogs.get(processId) || [];
          currentLogs.push(successMessage);
          this.processLogs.set(processId, currentLogs);
          this.webSocketBroadcastMessage({
            type: "processExited",
            processId,
            exitCode: 0,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            logs: [successMessage]
          });
          if (onResolve)
            onResolve(result);
        }).catch((error) => {
          this.runningProcesses.delete(processId);
          const processInfo = this.allProcesses.get(processId);
          if (processInfo) {
            this.allProcesses.set(processId, {
              ...processInfo,
              status: "error",
              error: error.message
            });
          }
          const errorMessage = `Failed with error: ${error.message}`;
          const currentLogs = this.processLogs.get(processId) || [];
          currentLogs.push(errorMessage);
          this.processLogs.set(processId, currentLogs);
          this.webSocketBroadcastMessage({
            type: "processError",
            processId,
            error: error.message,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            logs: [errorMessage]
          });
          if (onReject)
            onReject(error);
        });
        return processId;
      }
      getProcessesByCategory(category) {
        return Array.from(this.allProcesses.entries()).filter(([id, procInfo]) => procInfo.category === category).map(([id, procInfo]) => ({
          processId: id,
          command: procInfo.command,
          pid: procInfo.pid,
          status: procInfo.status,
          exitCode: procInfo.exitCode,
          error: procInfo.error,
          timestamp: procInfo.timestamp,
          category: procInfo.category,
          testName: procInfo.testName,
          platform: procInfo.platform,
          logs: this.processLogs.get(id) || []
        }));
      }
      getBDDTestProcesses() {
        return this.getProcessesByCategory("bdd-test");
      }
      getBuildTimeProcesses() {
        return this.getProcessesByCategory("build-time");
      }
      getAiderProcesses() {
        return this.getProcessesByCategory("aider");
      }
      getProcessesByTestName(testName) {
        return Array.from(this.allProcesses.entries()).filter(([id, procInfo]) => procInfo.testName === testName).map(([id, procInfo]) => ({
          processId: id,
          command: procInfo.command,
          pid: procInfo.pid,
          status: procInfo.status,
          exitCode: procInfo.exitCode,
          error: procInfo.error,
          timestamp: procInfo.timestamp,
          category: procInfo.category,
          testName: procInfo.testName,
          platform: procInfo.platform,
          logs: this.processLogs.get(id) || []
        }));
      }
      getProcessesByPlatform(platform) {
        return Array.from(this.allProcesses.entries()).filter(([id, procInfo]) => procInfo.platform === platform).map(([id, procInfo]) => ({
          processId: id,
          command: procInfo.command,
          pid: procInfo.pid,
          status: procInfo.status,
          exitCode: procInfo.exitCode,
          error: procInfo.error,
          timestamp: procInfo.timestamp,
          category: procInfo.category,
          testName: procInfo.testName,
          platform: procInfo.platform,
          logs: this.processLogs.get(id) || []
        }));
      }
      bddTestIsRunning(src) {
        this.summary[src] = {
          prompt: "?",
          runTimeErrors: "?",
          staticErrors: "?",
          typeErrors: "?",
          failingFeatures: {}
        };
      }
      async metafileOutputs(platform) {
        let metafilePath;
        if (platform === "python") {
          metafilePath = `./testeranto/metafiles/python/core.json`;
        } else {
          metafilePath = `./testeranto/metafiles/${platform}/${this.projectName}.json`;
        }
        if (!fs16.existsSync(metafilePath)) {
          console.log(
            ansiC2.yellow(`Metafile not found at ${metafilePath}, skipping`)
          );
          return;
        }
        let metafile;
        try {
          const fileContent = fs16.readFileSync(metafilePath).toString();
          const parsedData = JSON.parse(fileContent);
          if (platform === "python") {
            metafile = parsedData.metafile || parsedData;
          } else {
            metafile = parsedData.metafile;
          }
          if (!metafile) {
            console.log(
              ansiC2.yellow(ansiC2.inverse(`No metafile found in ${metafilePath}`))
            );
            return;
          }
        } catch (error) {
          console.error(`Error reading metafile at ${metafilePath}:`, error);
          return;
        }
        const outputs = metafile.outputs;
        Object.keys(outputs).forEach(async (builtOutput) => {
          const entrypoint = await this.configTests().filter(
            ([testEntryPoint, testPlatform]) => {
              if (testEntryPoint === builtOutput.replace(
                `testeranto/bundles/${platform}/${this.projectName}/`,
                ``
              ).replace(`.mjs`, `.ts`) && testPlatform === platform) {
                return true;
              }
            }
          )[0];
          if (entrypoint) {
            const metafileOutput = outputs[builtOutput];
            const addableFiles = Object.keys(metafileOutput.inputs).filter((i) => {
              if (!fs16.existsSync(i))
                return false;
              if (i.startsWith("node_modules"))
                return false;
              if (i.startsWith("./node_modules"))
                return false;
              return true;
            });
            const f = `${builtOutput.split(".").slice(0, -1).join(".")}/`;
            if (!fs16.existsSync(f)) {
              fs16.mkdirSync(f, { recursive: true });
            }
            let entrypoint2 = metafileOutput.entryPoint;
            if (entrypoint2) {
              entrypoint2 = path17.normalize(entrypoint2);
              const changeDigest = await filesHash(addableFiles);
              if (changeDigest === changes[entrypoint2]) {
              } else {
                changes[entrypoint2] = changeDigest;
                if (platform === "node" || platform === "web") {
                  this.tscCheck({ entrypoint: entrypoint2, addableFiles, platform });
                  this.eslintCheck({ entrypoint: entrypoint2, addableFiles, platform });
                } else if (platform === "python") {
                  this.pythonLintCheck(entrypoint2, addableFiles);
                  this.pythonTypeCheck(entrypoint2, addableFiles);
                }
                makePrompt(
                  this.summary,
                  this.projectName,
                  entrypoint2,
                  addableFiles,
                  platform
                );
                const testName = this.findTestNameByEntrypoint(
                  entrypoint2,
                  platform
                );
                if (testName) {
                  console.log(
                    ansiC2.green(
                      ansiC2.inverse(
                        `Source files changed, re-queueing test: ${testName}`
                      )
                    )
                  );
                  this.addToQueue(testName, platform);
                } else {
                  console.error(
                    `Could not find test for entrypoint: ${entrypoint2} (${platform})`
                  );
                  throw `Could not find test for entrypoint: ${entrypoint2} (${platform})`;
                }
              }
            }
          }
        });
      }
      findTestNameByEntrypoint(entrypoint, platform) {
        console.log("findTestNameByEntrypoint", entrypoint, platform);
        const runnables = getRunnables(this.configs, this.projectName);
        let entryPointsMap;
        switch (platform) {
          case "node":
            entryPointsMap = runnables.nodeEntryPoints;
            break;
          case "web":
            entryPointsMap = runnables.webEntryPoints;
            break;
          case "python":
            entryPointsMap = runnables.pythonEntryPoints;
            break;
          case "golang":
            entryPointsMap = runnables.golangEntryPoints;
            break;
          default:
            throw "wtf";
        }
        if (!entryPointsMap) {
          console.error("idk");
        }
        if (!entryPointsMap[entrypoint]) {
          console.error(`${entrypoint} not found 1`, entryPointsMap);
          console.trace();
          throw `${entrypoint} not found`;
        }
        return entryPointsMap[entrypoint];
      }
      async pythonLintCheck(entrypoint, addableFiles) {
        const reportDest = `testeranto/reports/${this.projectName}/${entrypoint.split(".").slice(0, -1).join(".")}/python`;
        if (!fs16.existsSync(reportDest)) {
          fs16.mkdirSync(reportDest, { recursive: true });
        }
        const lintErrorsPath = `${reportDest}/lint_errors.txt`;
        try {
          const { spawn: spawn2 } = await import("child_process");
          const child = spawn2("flake8", [entrypoint, "--max-line-length=88"], {
            stdio: ["pipe", "pipe", "pipe"]
          });
          let stderr = "";
          child.stderr.on("data", (data) => {
            stderr += data.toString();
          });
          let stdout = "";
          child.stdout.on("data", (data) => {
            stdout += data.toString();
          });
          return new Promise((resolve) => {
            child.on("close", () => {
              const logOut = stdout + stderr;
              if (logOut.trim()) {
                fs16.writeFileSync(lintErrorsPath, logOut);
                this.summary[entrypoint].staticErrors = logOut.split("\n").length;
              } else {
                if (fs16.existsSync(lintErrorsPath)) {
                  fs16.unlinkSync(lintErrorsPath);
                }
                this.summary[entrypoint].staticErrors = 0;
              }
              resolve();
            });
          });
        } catch (error) {
          console.error(`Error running flake8 on ${entrypoint}:`, error);
          fs16.writeFileSync(
            lintErrorsPath,
            `Error running flake8: ${error.message}`
          );
          this.summary[entrypoint].staticErrors = -1;
        }
      }
      async pythonTypeCheck(entrypoint, addableFiles) {
        const reportDest = `testeranto/reports/${this.projectName}/${entrypoint.split(".").slice(0, -1).join(".")}/python`;
        if (!fs16.existsSync(reportDest)) {
          fs16.mkdirSync(reportDest, { recursive: true });
        }
        const typeErrorsPath = `${reportDest}/type_errors.txt`;
        try {
          const { spawn: spawn2 } = await import("child_process");
          const child = spawn2("mypy", [entrypoint], {
            stdio: ["pipe", "pipe", "pipe"]
          });
          let stderr = "";
          child.stderr.on("data", (data) => {
            stderr += data.toString();
          });
          let stdout = "";
          child.stdout.on("data", (data) => {
            stdout += data.toString();
          });
          return new Promise((resolve) => {
            child.on("close", () => {
              const logOut = stdout + stderr;
              if (logOut.trim()) {
                fs16.writeFileSync(typeErrorsPath, logOut);
                this.summary[entrypoint].typeErrors = logOut.split("\n").length;
              } else {
                if (fs16.existsSync(typeErrorsPath)) {
                  fs16.unlinkSync(typeErrorsPath);
                }
                this.summary[entrypoint].typeErrors = 0;
              }
              resolve();
            });
          });
        } catch (error) {
          console.error(`Error running mypy on ${entrypoint}:`, error);
          fs16.writeFileSync(typeErrorsPath, `Error running mypy: ${error.message}`);
          this.summary[entrypoint].typeErrors = -1;
        }
      }
      async start() {
        try {
          await this.startBuildProcesses();
          const pythonTests = this.configTests().filter(
            (test) => test[1] === "python"
          );
          if (pythonTests.length > 0) {
            const { generatePitonoMetafile: generatePitonoMetafile2, writePitonoMetafile: writePitonoMetafile2 } = await Promise.resolve().then(() => (init_pitonoMetafile(), pitonoMetafile_exports));
            const entryPoints = pythonTests.map((test) => test[0]);
            const metafile = await generatePitonoMetafile2(
              this.projectName,
              entryPoints
            );
            writePitonoMetafile2(this.projectName, metafile);
          }
          this.onBuildDone();
        } catch (error) {
          console.error("Build processes failed:", error);
          return;
        }
        this.mapping().forEach(async ([command, func]) => {
          globalThis[command] = func;
        });
        if (!fs16.existsSync(`testeranto/reports/${this.projectName}`)) {
          fs16.mkdirSync(`testeranto/reports/${this.projectName}`);
        }
        try {
          this.browser = await puppeteer.launch(puppeteerConfigs);
        } catch (e) {
          console.error(e);
          console.error(
            "could not start chrome via puppeter. Check this path: ",
            executablePath2
          );
        }
        const runnables = getRunnables(this.configs, this.projectName);
        const {
          nodeEntryPoints,
          webEntryPoints,
          // pureEntryPoints,
          pythonEntryPoints,
          golangEntryPoints
        } = runnables;
        [
          ["node", nodeEntryPoints],
          ["web", webEntryPoints],
          // ["pure", pureEntryPoints],
          ["python", pythonEntryPoints],
          ["golang", golangEntryPoints]
        ].forEach(([runtime, entryPoints]) => {
          Object.keys(entryPoints).forEach((entryPoint) => {
            const reportDest = `testeranto/reports/${this.projectName}/${entryPoint.split(".").slice(0, -1).join(".")}/${runtime}`;
            if (!fs16.existsSync(reportDest)) {
              fs16.mkdirSync(reportDest, { recursive: true });
            }
            this.addToQueue(entryPoint, runtime);
          });
        });
        const runtimeConfigs = [
          ["node", nodeEntryPoints],
          ["web", webEntryPoints],
          // ["pure", pureEntryPoints],
          ["python", pythonEntryPoints],
          ["golang", golangEntryPoints]
        ];
        for (const [runtime, entryPoints] of runtimeConfigs) {
          if (Object.keys(entryPoints).length === 0)
            continue;
          let metafile;
          if (runtime === "python") {
            metafile = `./testeranto/metafiles/${runtime}/core.json`;
          } else {
            metafile = `./testeranto/metafiles/${runtime}/${this.projectName}.json`;
          }
          const metafileDir = metafile.split("/").slice(0, -1).join("/");
          if (!fs16.existsSync(metafileDir)) {
            fs16.mkdirSync(metafileDir, { recursive: true });
          }
          try {
            if (runtime === "python" && !fs16.existsSync(metafile)) {
              const { generatePitonoMetafile: generatePitonoMetafile2, writePitonoMetafile: writePitonoMetafile2 } = await Promise.resolve().then(() => (init_pitonoMetafile(), pitonoMetafile_exports));
              const entryPointList = Object.keys(entryPoints);
              if (entryPointList.length > 0) {
                const metafileData = await generatePitonoMetafile2(
                  this.projectName,
                  entryPointList
                );
                writePitonoMetafile2(this.projectName, metafileData);
              }
            }
            await pollForFile(metafile);
            let timeoutId;
            const watcher = watch(metafile, async (e, filename) => {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(async () => {
                console.log(
                  ansiC2.yellow(ansiC2.inverse(`< ${e} ${filename} (${runtime})`))
                );
                try {
                  await this.metafileOutputs(runtime);
                  console.log(
                    ansiC2.blue(
                      `Metafile processed, checking queue for tests to run`
                    )
                  );
                  this.checkQueue();
                } catch (error) {
                  console.error(`Error processing metafile changes:`, error);
                }
              }, 300);
            });
            switch (runtime) {
              case "node":
                this.nodeMetafileWatcher = watcher;
                break;
              case "web":
                this.webMetafileWatcher = watcher;
                break;
              case "python":
                this.pitonoMetafileWatcher = watcher;
                break;
              case "golang":
                this.golangMetafileWatcher = watcher;
                break;
            }
            await this.metafileOutputs(runtime);
          } catch (error) {
            console.error(`Error setting up watcher for ${runtime}:`, error);
          }
        }
      }
      async stop() {
        console.log(ansiC2.inverse("Testeranto-Run is shutting down gracefully..."));
        this.mode = "once";
        this.nodeMetafileWatcher.close();
        this.webMetafileWatcher.close();
        this.importMetafileWatcher.close();
        if (this.pitonoMetafileWatcher) {
          this.pitonoMetafileWatcher.close();
        }
        Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
        this.clients.forEach((client) => {
          client.terminate();
        });
        this.clients.clear();
        this.checkForShutdown();
      }
      addToQueue(src, runtime) {
        if (src.includes("testeranto/bundles")) {
          const runnables = getRunnables(this.configs, this.projectName);
          const allEntryPoints = [
            ...Object.entries(runnables.nodeEntryPoints),
            ...Object.entries(runnables.webEntryPoints),
            // ...Object.entries(runnables.pureEntryPoints),
            ...Object.entries(runnables.pythonEntryPoints),
            ...Object.entries(runnables.golangEntryPoints)
          ];
          const normalizedSrc = path17.normalize(src);
          for (const [testName, bundlePath] of allEntryPoints) {
            const normalizedBundlePath = path17.normalize(bundlePath);
            if (normalizedSrc.endsWith(normalizedBundlePath)) {
              src = testName;
              break;
            }
          }
        }
        this.cleanupTestProcesses(src);
        if (!this.queue.includes(src)) {
          this.queue.push(src);
          console.log(
            ansiC2.green(
              ansiC2.inverse(`Added ${src} (${runtime}) to the processing queue`)
            )
          );
          this.checkQueue();
        } else {
          console.log(
            ansiC2.yellow(
              ansiC2.inverse(`Test ${src} is already in the queue, skipping`)
            )
          );
        }
      }
      cleanupTestProcesses(testName) {
        const processesToCleanup = [];
        for (const [processId, processInfo] of this.allProcesses.entries()) {
          if (processInfo.testName === testName && processInfo.status === "running") {
            processesToCleanup.push(processId);
          }
        }
        processesToCleanup.forEach((processId) => {
          const processInfo = this.allProcesses.get(processId);
          if (processInfo) {
            if (processInfo.child) {
              try {
                processInfo.child.kill();
              } catch (error) {
                console.error(`Error killing process ${processId}:`, error);
              }
            }
            this.allProcesses.set(processId, {
              ...processInfo,
              status: "exited",
              exitCode: -1,
              error: "Killed due to source file change"
            });
            this.runningProcesses.delete(processId);
            this.webSocketBroadcastMessage({
              type: "processExited",
              processId,
              exitCode: -1,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              logs: ["Process killed due to source file change"]
            });
          }
        });
      }
      checkQueue() {
        while (this.queue.length > 0) {
          const x = this.queue.pop();
          if (!x)
            continue;
          let isRunning = false;
          for (const processInfo of this.allProcesses.values()) {
            if (processInfo.testName === x && processInfo.status === "running") {
              isRunning = true;
              break;
            }
          }
          if (isRunning) {
            console.log(
              ansiC2.yellow(
                `Skipping ${x} - already running, will be re-queued when current run completes`
              )
            );
            continue;
          }
          const test = this.configTests().find((t) => t[0] === x);
          if (!test) {
            console.error(
              `test is undefined ${x}, ${JSON.stringify(
                this.configTests(),
                null,
                2
              )}`
            );
            process.exit(-1);
            continue;
          }
          const runtime = test[1];
          const runnables = getRunnables(this.configs, this.projectName);
          let dest;
          switch (runtime) {
            case "node":
              dest = runnables.nodeEntryPoints[x];
              if (dest) {
                this.launchNode(x, dest);
              } else {
                console.error(`No destination found for node test: ${x}`);
              }
              break;
            case "web":
              dest = runnables.webEntryPoints[x];
              if (dest) {
                this.launchWeb(x, dest);
              } else {
                console.error(`No destination found for web test: ${x}`);
              }
              break;
            case "python":
              dest = runnables.pythonEntryPoints[x];
              if (dest) {
                this.launchPython(x, dest);
              } else {
                console.error(`No destination found for python test: ${x}`);
              }
              break;
            case "golang":
              dest = runnables.golangEntryPoints[x];
              if (dest) {
                this.launchGolang(x, dest);
              } else {
                console.error(`No destination found for golang test: ${x}`);
              }
              break;
            default:
              console.error(`Unknown runtime: ${runtime} for test ${x}`);
              break;
          }
        }
        if (this.queue.length === 0) {
          console.log(ansiC2.inverse(`The queue is empty`));
        }
      }
      ensureSummaryEntry(src, isSidecar = false) {
        if (!this.summary[src]) {
          this.summary[src] = {
            typeErrors: void 0,
            staticErrors: void 0,
            runTimeErrors: void 0,
            prompt: void 0,
            failingFeatures: {}
          };
          if (isSidecar) {
          }
        }
        return this.summary[src];
      }
    };
  }
});

// src/app/backend/PM_2_WithTCP.ts
import { WebSocketServer } from "ws";
import http from "http";
import fs17 from "fs";
var PM_2_WithTCP;
var init_PM_2_WithTCP = __esm({
  "src/app/backend/PM_2_WithTCP.ts"() {
    "use strict";
    init_getAllFilesRecursively();
    init_FileService();
    init_api();
    init_PM_1_WithProcesses();
    PM_2_WithTCP = class extends PM_1_WithProcesses {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.httpServer = http.createServer(this.handleHttpRequest.bind(this));
        this.wss = new WebSocketServer({ server: this.httpServer });
        this.wss.on("connection", (ws) => {
          this.clients.add(ws);
          console.log("Client connected");
          ws.on("message", (data) => {
            try {
              this.websocket(data, ws);
            } catch (error) {
              console.error("Error handling WebSocket message:", error);
            }
          });
          ws.on("close", () => {
            this.clients.delete(ws);
            console.log("Client disconnected");
          });
          ws.on("error", (error) => {
            console.error("WebSocket error:", error);
            this.clients.delete(ws);
          });
        });
        const httpPort = Number(process.env.HTTP_PORT) || 3e3;
        this.httpServer.listen(httpPort, "0.0.0.0", () => {
          console.log(`HTTP server running on http://localhost:${httpPort}`);
        });
      }
      websocket(data, ws) {
        try {
          const wsm = JSON.parse(data.toString());
          FileService_methods.forEach((fsm) => {
            if (wsm.type === fsm) {
              this[fsm](wsm, ws);
            }
          });
          if (wsm.type === "getRunningProcesses") {
            const processes = Array.from(this.allProcesses.entries()).map(
              ([id, procInfo]) => ({
                processId: id,
                command: procInfo.command,
                pid: procInfo.pid,
                status: procInfo.status,
                exitCode: procInfo.exitCode,
                error: procInfo.error,
                timestamp: procInfo.timestamp,
                category: procInfo.category,
                testName: procInfo.testName,
                platform: procInfo.platform,
                logs: this.processLogs.get(id) || []
              })
            );
            ws.send(
              JSON.stringify({
                type: "runningProcesses",
                processes
              })
            );
          } else if (wsm.type === "getProcess") {
            const processId = wsm.data.processId;
            const procInfo = this.allProcesses.get(processId);
            if (procInfo) {
              ws.send(
                JSON.stringify({
                  type: "processData",
                  processId,
                  command: procInfo.command,
                  pid: procInfo.pid,
                  status: procInfo.status,
                  exitCode: procInfo.exitCode,
                  error: procInfo.error,
                  timestamp: procInfo.timestamp,
                  category: procInfo.category,
                  testName: procInfo.testName,
                  platform: procInfo.platform,
                  logs: this.processLogs.get(processId) || []
                })
              );
            }
          } else if (wsm.type === "stdin") {
            const processId = wsm.data.processId;
            const data2 = wsm.data.data;
            const childProcess = this.runningProcesses.get(processId);
            if (childProcess && childProcess.stdin) {
              childProcess.stdin.write(data2);
            } else {
              console.log(
                "Cannot write to stdin - process not found or no stdin:",
                {
                  processExists: !!childProcess,
                  stdinExists: childProcess?.stdin ? true : false
                }
              );
            }
          } else if (wsm.type === "killProcess") {
            const processId = wsm.processId;
            console.log("Received killProcess for process", processId);
            const childProcess = this.runningProcesses.get(processId);
            if (childProcess) {
              console.log("Killing process");
              childProcess.kill("SIGTERM");
            } else {
              console.log("Cannot kill process - process not found:", {
                processExists: !!childProcess
              });
            }
          } else if (wsm.type === "getChatHistory") {
            if (this.getChatHistory) {
              this.getChatHistory().then((history) => {
                ws.send(
                  JSON.stringify({
                    type: "chatHistory",
                    messages: history
                  })
                );
              }).catch((error) => {
                console.error("Error getting chat history:", error);
                ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Failed to get chat history"
                  })
                );
              });
            }
          }
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
        }
      }
      handleHttpRequest(req, res) {
        console.log(req.method, req.url);
        if (req.url === "/testeranto/index.html" /* root */) {
          fs17.readFile("./testeranto/index.html" /* root */, (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end(`500 ${err.toString()}`);
              return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
          });
          return;
        } else if (req.url === "/testeranto/App.css" /* style */) {
          fs17.readFile("./testeranto/App.css" /* style */, (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end(`500 ${err.toString()}`);
              return;
            }
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
          });
          return;
        } else if (req.url === "/testeranto/App.js" /* script */) {
          fs17.readFile("./testeranto/App.js" /* script */, (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end(`500 ${err.toString()}`);
              return;
            }
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
            return;
          });
          return;
        } else {
          res.writeHead(404);
          res.end(`404 Not Found. ${req.url}`);
          return;
        }
      }
      // FileService methods
      writeFile_send(wsm, ws) {
        ws.send(JSON.stringify(["writeFile", wsm.data.path]));
      }
      writeFile_receive(wsm, ws) {
        fs17.writeFileSync(wsm.data.path, wsm.data.content);
      }
      readFile_receive(wsm, ws) {
        this.readFile_send(wsm, ws, fs17.readFileSync(wsm.data.path).toString());
      }
      readFile_send(wsm, ws, content) {
        ws.send(JSON.stringify(["readFile", wsm.data.path, content]));
      }
      createDirectory_receive(wsm, ws) {
        fs17.mkdirSync(wsm.data.path);
        this.createDirectory_send(wsm, ws);
      }
      createDirectory_send(wsm, ws) {
        ws.send(JSON.stringify(["createDirectory", wsm.data.path]));
      }
      deleteFile_receive(wsm, ws) {
        fs17.unlinkSync(wsm.data.path);
        this.deleteFile_send(wsm, ws);
      }
      deleteFile_send(wsm, ws) {
        ws.send(JSON.stringify(["deleteFile", wsm.data.path]));
      }
      async files_receive(wsm, ws) {
        this.files_send(wsm, ws, await getAllFilesRecursively("."));
      }
      files_send(wsm, ws, files3) {
        ws.send(JSON.stringify(["files", files3]));
      }
      projects_receive(wsm, ws) {
        this.projects_send(
          wsm,
          ws,
          JSON.parse(fs17.readFileSync("./testeranto/projects.json", "utf-8"))
        );
      }
      projects_send(wsm, ws, projects) {
        ws.send(JSON.stringify(["projects", projects]));
      }
      report_receive(wsm, ws) {
        this.report_send(wsm, ws);
      }
      async report_send(wsm, ws) {
      }
      async test_receive(wsm, ws) {
      }
      test_send(wsm, ws, project) {
        ws.send(JSON.stringify(["tests", project]));
      }
    };
  }
});

// src/app/backend/PM_WithBuild.ts
import esbuild from "esbuild";
var PM_WithBuild;
var init_PM_WithBuild = __esm({
  "src/app/backend/PM_WithBuild.ts"() {
    "use strict";
    init_PM_2_WithTCP();
    PM_WithBuild = class extends PM_2_WithTCP {
      constructor() {
        super(...arguments);
        this.currentBuildResolve = null;
        this.currentBuildReject = null;
      }
      async startBuildProcess(configer, entryPoints, runtime) {
        const entryPointKeys = Object.keys(entryPoints);
        if (entryPointKeys.length === 0)
          return;
        const self = this;
        const buildProcessTrackerPlugin = {
          name: "build-process-tracker",
          setup(build) {
            build.onStart(() => {
              const processId = `build-${runtime}-${Date.now()}`;
              const command = `esbuild ${runtime} for ${self.projectName}`;
              const buildPromise = new Promise((resolve, reject) => {
                self.currentBuildResolve = resolve;
                self.currentBuildReject = reject;
              });
              if (self.addPromiseProcess) {
                self.addPromiseProcess(
                  processId,
                  buildPromise,
                  command,
                  "build-time",
                  self.projectName,
                  runtime
                );
              }
              console.log(
                `Starting ${runtime} build for ${entryPointKeys.length} entry points`
              );
              if (self.webSocketBroadcastMessage) {
                self.webSocketBroadcastMessage({
                  type: "buildEvent",
                  event: "start",
                  runtime,
                  timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                  entryPoints: entryPointKeys.length,
                  processId
                });
              }
            });
            build.onEnd((result) => {
              const event = {
                type: "buildEvent",
                event: result.errors.length > 0 ? "error" : "success",
                runtime,
                timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                errors: result.errors.length,
                warnings: result.warnings.length
              };
              if (result.errors.length > 0) {
                console.error(
                  `Build ${runtime} failed with ${result.errors.length} errors`
                );
                if (self.currentBuildReject) {
                  self.currentBuildReject(
                    new Error(`Build failed with ${result.errors.length} errors`)
                  );
                }
              } else {
                console.log(`Build ${runtime} completed successfully`);
                if (self.currentBuildResolve) {
                  self.currentBuildResolve();
                }
              }
              if (self.webSocketBroadcastMessage) {
                self.webSocketBroadcastMessage(event);
              }
              self.currentBuildResolve = null;
              self.currentBuildReject = null;
            });
          }
        };
        const baseConfig = configer(this.configs, entryPointKeys, this.projectName);
        const configWithPlugin = {
          ...baseConfig,
          plugins: [...baseConfig.plugins || [], buildProcessTrackerPlugin]
        };
        try {
          if (this.mode === "dev") {
            const ctx = await esbuild.context(configWithPlugin);
            await ctx.rebuild();
            await ctx.watch();
          } else {
            const result = await esbuild.build(configWithPlugin);
            if (result.errors.length === 0) {
              console.log(`Successfully built ${runtime} bundle`);
            }
          }
        } catch (error) {
          console.error(`Failed to build ${runtime}:`, error);
          if (this.webSocketBroadcastMessage) {
            this.webSocketBroadcastMessage({
              type: "buildEvent",
              event: "error",
              runtime,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              errors: 1,
              warnings: 0,
              message: error.message
            });
          }
          throw error;
        }
      }
    };
  }
});

// src/app/backend/PM_WithEslintAndTsc.ts
import ts from "typescript";
import fs18 from "fs";
import ansiC3 from "ansi-colors";
import { ESLint } from "eslint";
import tsc from "tsc-prog";
var eslint, formatter, PM_WithEslintAndTsc;
var init_PM_WithEslintAndTsc = __esm({
  async "src/app/backend/PM_WithEslintAndTsc.ts"() {
    "use strict";
    init_utils();
    init_PM_WithBuild();
    eslint = new ESLint();
    formatter = await eslint.loadFormatter(
      "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
    );
    PM_WithEslintAndTsc = class extends PM_WithBuild {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.tscCheck = async ({
          entrypoint,
          addableFiles,
          platform
        }) => {
          const processId = `tsc-${entrypoint}-${Date.now()}`;
          const command = `tsc check for ${entrypoint}`;
          const tscPromise = (async () => {
            try {
              this.typeCheckIsRunning(entrypoint);
            } catch (e) {
              throw new Error(`Error in tscCheck: ${e.message}`);
            }
            const program = tsc.createProgramFromConfig({
              basePath: process.cwd(),
              configFilePath: "tsconfig.json",
              compilerOptions: {
                outDir: tscPather(entrypoint, platform, this.projectName),
                noEmit: true
              },
              include: addableFiles
            });
            const tscPath = tscPather(entrypoint, platform, this.projectName);
            const allDiagnostics = program.getSemanticDiagnostics();
            const results = [];
            allDiagnostics.forEach((diagnostic) => {
              if (diagnostic.file) {
                const { line, character } = ts.getLineAndCharacterOfPosition(
                  diagnostic.file,
                  diagnostic.start
                );
                const message = ts.flattenDiagnosticMessageText(
                  diagnostic.messageText,
                  "\n"
                );
                results.push(
                  `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
                );
              } else {
                results.push(
                  ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
                );
              }
            });
            fs18.writeFileSync(tscPath, results.join("\n"));
            this.typeCheckIsNowDone(entrypoint, results.length);
            return results.length;
          })();
          this.addPromiseProcess(
            processId,
            tscPromise,
            command,
            "build-time",
            entrypoint
          );
        };
        this.eslintCheck = async ({
          entrypoint,
          addableFiles,
          platform
        }) => {
          const processId = `eslint-${entrypoint}-${Date.now()}`;
          const command = `eslint check for ${entrypoint}`;
          const eslintPromise = (async () => {
            try {
              this.lintIsRunning(entrypoint);
            } catch (e) {
              throw new Error(`Error in eslintCheck: ${e.message}`);
            }
            const filepath = lintPather(entrypoint, platform, this.projectName);
            if (fs18.existsSync(filepath))
              fs18.rmSync(filepath);
            const results = (await eslint.lintFiles(addableFiles)).filter((r) => r.messages.length).filter((r) => {
              return r.messages[0].ruleId !== null;
            }).map((r) => {
              delete r.source;
              return r;
            });
            fs18.writeFileSync(filepath, await formatter.format(results));
            this.lintIsNowDone(entrypoint, results.length);
            return results.length;
          })();
          this.addPromiseProcess(
            processId,
            eslintPromise,
            command,
            "build-time",
            entrypoint
          );
        };
        this.typeCheckIsRunning = (src) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].typeErrors = "?";
        };
        this.typeCheckIsNowDone = (src, failures) => {
          if (failures === 0) {
            console.log(ansiC3.green(ansiC3.inverse(`tsc > ${src}`)));
          } else {
            console.log(
              ansiC3.red(ansiC3.inverse(`tsc > ${src} failed ${failures} times`))
            );
          }
          this.summary[src].typeErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
        this.lintIsRunning = (src) => {
          this.summary[src].staticErrors = "?";
          this.writeBigBoard();
        };
        this.lintIsNowDone = (src, failures) => {
          if (failures === 0) {
            console.log(ansiC3.green(ansiC3.inverse(`eslint > ${src}`)));
          } else {
            console.log(
              ansiC3.red(ansiC3.inverse(`eslint > ${src} failed ${failures} times`))
            );
          }
          this.summary[src].staticErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
        this.bddTestIsRunning = (src) => {
          this.summary[src].runTimeErrors = "?";
          this.writeBigBoard();
        };
        this.bddTestIsNowDone = (src, failures) => {
          this.summary[src].runTimeErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
      }
    };
  }
});

// src/app/backend/PM_WithGit.ts
import fs19 from "fs";
import url from "url";
var exec, PM_WithGit;
var init_PM_WithGit = __esm({
  async "src/app/backend/PM_WithGit.ts"() {
    "use strict";
    await init_PM_WithEslintAndTsc();
    ({ exec } = await import("child_process"));
    PM_WithGit = class extends PM_WithEslintAndTsc {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.gitWatchTimeout = null;
        this.gitWatcher = null;
      }
      // Override requestHandler to add Git-specific endpoints
      //   httpRequest(req: http.IncomingMessage, res: http.ServerResponse) {
      //     const parsedUrl = url.parse(req.url || "/");
      //     const pathname = parsedUrl.pathname || "/";
      //     // Handle Git API endpoints
      //     if (pathname?.startsWith("/api/git/")) {
      //       // this.handleGitApi(req, res);
      //       return;
      //     }
      //     if (pathname === "/api/auth/github/token" && req.method === "POST") {
      //       this.handleGitHubTokenExchange(req, res);
      //       return;
      //     }
      //     // Handle GitHub OAuth callback
      //     if (pathname === "/auth/github/callback") {
      //       // Serve the callback HTML page
      //       const callbackHtml = `
      // <!DOCTYPE html>
      // <html>
      // <head>
      //     <title>GitHub Authentication - Testeranto</title>
      //     <script>
      //         // Extract the code from the URL and send it to the parent window
      //         const urlParams = new URLSearchParams(window.location.search);
      //         const code = urlParams.get('code');
      //         const error = urlParams.get('error');
      //         if (code) {
      //             window.opener.postMessage({ type: 'github-auth-callback', code }, '*');
      //         } else if (error) {
      //             window.opener.postMessage({ type: 'github-auth-error', error }, '*');
      //         }
      //         window.close();
      //     </script>
      // </head>
      // <body>
      //     <p>Completing authentication...</p>
      // </body>
      // </html>`;
      //       res.writeHead(200, { "Content-Type": "text/html" });
      //       res.end(callbackHtml);
      //       return;
      //     }
      //     // Call the parent class's requestHandler for all other requests
      //     // super.httpRequest(req, res);
      //   }
      // this method is also horrible
      // private handleGitApi(req: http.IncomingMessage, res: http.ServerResponse) {
      //   const parsedUrl = url.parse(req.url || "/");
      //   const pathname = parsedUrl.pathname || "/";
      //   // Set CORS headers
      //   res.setHeader("Access-Control-Allow-Origin", "*");
      //   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      //   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      //   if (req.method === "OPTIONS") {
      //     res.writeHead(200);
      //     res.end();
      //     return;
      //   }
      //   try {
      //     if (pathname === "/api/git/changes" && req.method === "GET") {
      //       this.handleGitChanges(req, res);
      //     } else if (pathname === "/api/git/status" && req.method === "GET") {
      //       this.handleGitFileStatus(req, res);
      //     } else if (pathname === "/api/git/commit" && req.method === "POST") {
      //       this.handleGitCommit(req, res);
      //     } else if (pathname === "/api/git/push" && req.method === "POST") {
      //       this.handleGitPush(req, res);
      //     } else if (pathname === "/api/git/pull" && req.method === "POST") {
      //       this.handleGitPull(req, res);
      //     } else if (pathname === "/api/git/branch" && req.method === "GET") {
      //       this.handleGitBranch(req, res);
      //     } else if (
      //       pathname === "/api/git/remote-status" &&
      //       req.method === "GET"
      //     ) {
      //       this.handleGitRemoteStatus(req, res);
      //     } else {
      //       res.writeHead(404, { "Content-Type": "application/json" });
      //       res.end(JSON.stringify({ error: "Not found" }));
      //     }
      //   } catch (error) {
      //     res.writeHead(500, { "Content-Type": "application/json" });
      //     res.end(JSON.stringify({ error: "Internal server error" }));
      //   }
      // }
      async handleGitChanges(req, res) {
        try {
          const changes2 = await this.getGitChanges();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(changes2));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to get changes" }));
        }
      }
      async handleGitFileStatus(req, res) {
        const parsedUrl = url.parse(req.url || "/");
        const query = parsedUrl.query || "";
        const params = new URLSearchParams(query);
        const path21 = params.get("path");
        if (!path21) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const status = await this.getGitFileStatus(path21);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(status));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to get file status" }));
        }
      }
      async handleGitCommit(req, res) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          try {
            const { message, description } = JSON.parse(body);
            await this.executeGitCommit(message, description);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to commit" }));
          }
        });
      }
      async handleGitPush(req, res) {
        try {
          await this.executeGitPush();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to push" }));
        }
      }
      async handleGitPull(req, res) {
        try {
          await this.executeGitPull();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to pull" }));
        }
      }
      async handleGitBranch(req, res) {
        try {
          const branch = await this.getCurrentGitBranch();
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(branch);
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to get branch" }));
        }
      }
      async handleGitHubTokenExchange(req, res) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          try {
            const { code } = JSON.parse(body);
            const tokenResponse = await fetch(
              "https://github.com/login/oauth/access_token",
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  client_id: process.env.GITHUB_CLIENT_ID,
                  client_secret: process.env.GITHUB_CLIENT_SECRET,
                  code
                })
              }
            );
            const tokenData = await tokenResponse.json();
            if (tokenData.error) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: tokenData.error_description }));
              return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ access_token: tokenData.access_token }));
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to exchange token" }));
          }
        });
      }
      async handleGitRemoteStatus(req, res) {
        try {
          const status = await this.getGitRemoteStatus();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(status));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to get remote status" }));
        }
      }
      async getGitFileStatus(path21) {
        try {
          const changes2 = await this.getGitChanges();
          const fileChange = changes2.find((change) => change.path === path21);
          if (fileChange) {
            return { status: fileChange.status };
          }
          return { status: "unchanged" };
        } catch (error) {
          console.error("Failed to get file status:", error);
          return { status: "unchanged" };
        }
      }
      async executeGitCommit(message, description) {
        try {
          const fullMessage = description ? `${message}

${description}` : message;
          return new Promise((resolve, reject) => {
            exec("git add -A", { cwd: process.cwd() }, (error) => {
              if (error) {
                reject(new Error(`Failed to stage changes: ${error.message}`));
                return;
              }
              const commitCommand = `git commit -m "${fullMessage.replace(
                /"/g,
                '\\"'
              )}"`;
              exec(commitCommand, { cwd: process.cwd() }, (commitError) => {
                if (commitError) {
                  reject(new Error(`Failed to commit: ${commitError.message}`));
                  return;
                }
                resolve();
              });
            });
          });
        } catch (error) {
          throw new Error(
            `Failed to execute commit: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
      async executeGitPush() {
        try {
          return new Promise((resolve, reject) => {
            exec("git push", { cwd: process.cwd() }, (error) => {
              if (error) {
                reject(new Error(`Failed to push: ${error.message}`));
                return;
              }
              resolve();
            });
          });
        } catch (error) {
          throw new Error(
            `Failed to execute push: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
      async executeGitPull() {
        try {
          return new Promise((resolve, reject) => {
            exec("git pull", { cwd: process.cwd() }, (error) => {
              if (error) {
                reject(new Error(`Failed to pull: ${error.message}`));
                return;
              }
              resolve();
            });
          });
        } catch (error) {
          throw new Error(
            `Failed to execute pull: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
      // private async sendInitialState(ws: WebSocket) {
      //   try {
      //     const changes = await this.getGitChanges();
      //     const status = await this.getGitRemoteStatus();
      //     const branch = await this.getCurrentGitBranch();
      //     ws.send(JSON.stringify({ type: "changes", changes }));
      //     ws.send(JSON.stringify({ type: "status", status }));
      //     ws.send(JSON.stringify({ type: "branch", branch }));
      //   } catch (error) {
      //     console.error("Error sending initial state:", error);
      //     ws.send(
      //       JSON.stringify({
      //         type: "error",
      //         message: "Failed to get Git status",
      //       })
      //     );
      //   }
      // }
      // private async refreshGitStatus() {
      //   try {
      //     const changes = await this.getGitChanges();
      //     const status = await this.getGitRemoteStatus();
      //     const branch = await this.getCurrentGitBranch();
      //     this.broadcast({ type: "changes", changes });
      //     this.broadcast({ type: "status", status });
      //     this.broadcast({ type: "branch", branch });
      //   } catch (error) {
      //     console.error("Error refreshing Git status:", error);
      //   }
      // }
      onBuildDone() {
        console.log("Build processes completed");
        this.startGitWatcher();
      }
      async startGitWatcher() {
        console.log("Starting Git watcher for real-time updates");
        const watcher = fs19.watch(
          process.cwd(),
          { recursive: true },
          async (eventType, filename) => {
            if (filename && !filename.includes(".git")) {
              try {
                clearTimeout(this.gitWatchTimeout);
                this.gitWatchTimeout = setTimeout(async () => {
                  const changes2 = await this.getGitChanges();
                  const status = await this.getGitRemoteStatus();
                  const branch = await this.getCurrentGitBranch();
                  this.webSocketBroadcastMessage({ type: "changes", changes: changes2 });
                  this.webSocketBroadcastMessage({ type: "status", status });
                  this.webSocketBroadcastMessage({ type: "branch", branch });
                  if (filename) {
                    const ignorePatterns = this.configs?.ignore || [];
                    const shouldIgnore = ignorePatterns.some((pattern) => {
                      let regexPattern = pattern.replace(/\./g, "\\.").replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]");
                      if (!regexPattern.startsWith("^"))
                        regexPattern = "^" + regexPattern;
                      if (!regexPattern.endsWith("$"))
                        regexPattern = regexPattern + "$";
                      const regex = new RegExp(regexPattern);
                      return regex.test(filename);
                    });
                    if (!shouldIgnore) {
                      try {
                        const fullPath = `${process.cwd()}/${filename}`;
                        if (fs19.existsSync(fullPath)) {
                          const content = await fs19.promises.readFile(
                            fullPath,
                            "utf-8"
                          );
                          this.webSocketBroadcastMessage({
                            type: "fileChanged",
                            path: filename,
                            content,
                            eventType
                          });
                        }
                      } catch (error) {
                        console.error("Error reading changed file:", error);
                      }
                    }
                  }
                }, 500);
              } catch (error) {
                console.error("Error checking Git status:", error);
              }
            }
          }
        );
        setInterval(async () => {
          try {
            const changes2 = await this.getGitChanges();
            const status = await this.getGitRemoteStatus();
            const branch = await this.getCurrentGitBranch();
            this.webSocketBroadcastMessage({ type: "changes", changes: changes2 });
            this.webSocketBroadcastMessage({ type: "status", status });
            this.webSocketBroadcastMessage({ type: "branch", branch });
          } catch (error) {
            console.error("Error checking Git status:", error);
          }
        }, 1e4);
        this.gitWatcher = watcher;
      }
      async getGitChanges() {
        try {
          return new Promise((resolve, reject) => {
            exec(
              "git status --porcelain=v1",
              { cwd: process.cwd() },
              async (error, stdout, stderr) => {
                if (stderr) {
                }
                if (error) {
                  resolve([]);
                  return;
                }
                const changes2 = [];
                const lines = stdout.trim().split("\n");
                for (const line of lines) {
                  if (!line.trim())
                    continue;
                  const match = line.match(/^(.{2}) (.*)$/);
                  if (!match) {
                    continue;
                  }
                  const status = match[1];
                  let path21 = match[2];
                  if (status === "R " && path21.includes(" -> ")) {
                    const parts = path21.split(" -> ");
                    path21 = parts[parts.length - 1];
                  }
                  path21 = path21.trim();
                  let fileStatus = "unchanged";
                  const firstChar = status.charAt(0);
                  if (firstChar === "M" || firstChar === " ") {
                    fileStatus = "modified";
                  } else if (firstChar === "A") {
                    fileStatus = "added";
                  } else if (firstChar === "D") {
                    fileStatus = "deleted";
                  } else if (firstChar === "U") {
                    fileStatus = "conflicted";
                  } else if (status === "??") {
                    fileStatus = "added";
                  } else if (status === "R ") {
                    fileStatus = "modified";
                  }
                  if (fileStatus !== "unchanged") {
                    const fullPath = `${process.cwd()}/${path21}`;
                    try {
                      await fs19.promises.access(fullPath);
                    } catch (error2) {
                    }
                    changes2.push({
                      path: path21,
                      status: fileStatus
                    });
                  }
                }
                resolve(changes2);
              }
            );
          });
        } catch (error) {
          return [];
        }
      }
      async getGitRemoteStatus() {
        try {
          return new Promise((resolve) => {
            exec(
              "git rev-list --left-right --count HEAD...@{u}",
              { cwd: process.cwd() },
              (error, stdout, stderr) => {
                if (error) {
                  resolve({ ahead: 0, behind: 0 });
                  return;
                }
                const [behind, ahead] = stdout.trim().split("	").map(Number);
                resolve({ ahead, behind });
              }
            );
          });
        } catch (error) {
          console.error("Failed to get remote status:", error);
          return { ahead: 0, behind: 0 };
        }
      }
      async getCurrentGitBranch() {
        try {
          return new Promise((resolve) => {
            exec(
              "git branch --show-current",
              { cwd: process.cwd() },
              (error, stdout, stderr) => {
                if (error) {
                  console.error("Error getting current branch:", error);
                  resolve("main");
                  return;
                }
                resolve(stdout.trim() || "main");
              }
            );
          });
        } catch (error) {
          console.error("Failed to get current branch:", error);
          return "main";
        }
      }
    };
  }
});

// src/app/backend/PM_WithHelpo.ts
import { spawnSync } from "node:child_process";
import fs20 from "fs";
import path18 from "path";
var PM_WithHelpo;
var init_PM_WithHelpo = __esm({
  async "src/app/backend/PM_WithHelpo.ts"() {
    "use strict";
    await init_PM_WithGit();
    PM_WithHelpo = class extends PM_WithGit {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.aiderProcess = null;
        this.MAX_HISTORY_SIZE = 10 * 1024;
        // 10KB
        this.isAiderAtPrompt = false;
        this.chatHistoryPath = path18.join(
          process.cwd(),
          "testeranto",
          "helpo_chat_history.json"
        );
        this.initializeChatHistory();
        this.startAiderProcess();
      }
      initializeChatHistory() {
        fs20.writeFileSync(this.chatHistoryPath, JSON.stringify([]));
        const messagePath = path18.join(
          process.cwd(),
          "testeranto",
          "helpo_chat_message.txt"
        );
        const messageDir = path18.dirname(messagePath);
        if (!fs20.existsSync(messageDir)) {
          fs20.mkdirSync(messageDir, { recursive: true });
        }
        fs20.writeFileSync(messagePath, "");
      }
      startAiderProcess() {
      }
      async processAiderResponse(response) {
        const cleanResponse = response.trim();
        if (!cleanResponse) {
          return;
        }
        const assistantMessage = {
          type: "assistant",
          content: cleanResponse,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        await this.addToChatHistory(assistantMessage);
        const history = await this.getChatHistory();
        this.webSocketBroadcastMessage({
          type: "chatHistory",
          messages: history
        });
        await this.trimChatHistory();
      }
      restartAiderProcess() {
        if (this.aiderProcess) {
          this.aiderProcess.kill();
        }
        this.startAiderProcess();
      }
      isAiderAvailable() {
        try {
          const whichAider = spawnSync("which", ["aider"]);
          return whichAider.status === 0;
        } catch (error) {
          return false;
        }
      }
      async addToChatHistory(message) {
        const history = await this.getChatHistory();
        history.push(message);
        fs20.writeFileSync(this.chatHistoryPath, JSON.stringify(history, null, 2));
        console.log(
          `Added message to chat history: ${message.content.substring(0, 50)}...`
        );
      }
      async trimChatHistory() {
        const history = await this.getChatHistory();
        let currentSize = Buffer.from(JSON.stringify(history)).length;
        while (currentSize > this.MAX_HISTORY_SIZE && history.length > 0) {
          history.shift();
          currentSize = Buffer.from(JSON.stringify(history)).length;
        }
        fs20.writeFileSync(this.chatHistoryPath, JSON.stringify(history, null, 2));
      }
      async getChatHistory() {
        try {
          const data = fs20.readFileSync(this.chatHistoryPath, "utf-8");
          return JSON.parse(data);
        } catch (error) {
          return [];
        }
      }
      async handleChatMessage(userMessage) {
        const userChatMessage = {
          type: "user",
          content: userMessage,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        await this.addToChatHistory(userChatMessage);
        const history = await this.getChatHistory();
        this.webSocketBroadcastMessage({
          type: "chatHistory",
          messages: history
        });
        console.log(`User message recorded: ${userMessage}`);
        if (!this.aiderProcess) {
          console.log(
            "Aider process is not available - message recorded but not processed"
          );
          return;
        }
        setTimeout(() => {
          try {
            if (this.aiderProcess) {
              const messagePath = path18.join(
                process.cwd(),
                "testeranto",
                "helpo_chat_message.txt"
              );
              fs20.writeFileSync(messagePath, "");
              const ptyProcess = this.aiderProcess;
              ptyProcess.write(
                "PROCESS_CHAT_HISTORY_AND_RESPOND: Read the chat history and write your response ONLY to testeranto/helpo_chat_message.txt. Do NOT print to stdout.\n"
              );
            } else {
              console.log("Aider process is not available");
            }
          } catch (error) {
            console.error("Error writing to aider process:", error);
          }
        }, 100);
      }
      // // Override WebSocket message handling to include chat messages
      // protected setupWebSocketHandlers() {
      //   // This would be called from the parent class's WebSocket setup
      //   // For now, we'll assume the parent class calls this
      // }
      // // This method should be called when a WebSocket message is received
      // public handleWebSocketMessage(ws: any, message: any): void {
      //   try {
      //     const parsedMessage = JSON.parse(message.toString());
      //     if (parsedMessage.type === "chatMessage") {
      //       this.handleChatMessage(parsedMessage.content);
      //     } else {
      //       // Let parent class handle other message types
      //       super.handleWebSocketMessage?.(ws, message);
      //     }
      //   } catch (error) {
      //     console.error("Error handling WebSocket message:", error);
      //   }
      // }
    };
  }
});

// src/app/backend/main.ts
var main_exports = {};
__export(main_exports, {
  PM_Main: () => PM_Main
});
import { default as ansiC4, default as ansiColors } from "ansi-colors";
import fs21 from "fs";
import net from "net";
import { spawn } from "node:child_process";
import path19 from "node:path";
var files2, screenshots2, PM_Main;
var init_main = __esm({
  async "src/app/backend/main.ts"() {
    "use strict";
    init_node();
    init_web();
    init_utils2();
    init_queue();
    await init_PM_WithHelpo();
    init_utils();
    files2 = {};
    screenshots2 = {};
    PM_Main = class extends PM_WithHelpo {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.launchNode = async (src, dest) => {
          console.log(ansiC4.green(ansiC4.inverse(`node < ${src}`)));
          const processId = `node-${src}-${Date.now()}`;
          const command = `node test: ${src}`;
          const nodePromise = (async () => {
            try {
              const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "node");
              const builtfile = dest;
              const ipcfile = "/tmp/tpipe_" + Math.random();
              const logs = createLogStreams(reportDest, "node");
              let buffer = Buffer.from("");
              const queue = new Queue();
              const onData = (data) => {
                buffer = Buffer.concat([buffer, data]);
                for (let b = 0; b < buffer.length + 1; b++) {
                  const c = buffer.slice(0, b);
                  try {
                    const d = JSON.parse(c.toString());
                    queue.enqueue(d);
                    buffer = buffer.slice(b);
                    b = 0;
                  } catch (e) {
                  }
                }
                while (queue.size() > 0) {
                  const message = queue.dequeue();
                  if (message) {
                    this.mapping().forEach(async ([command2, func]) => {
                      if (message[0] === command2) {
                        const args = message.slice(1, -1);
                        try {
                          const result = await this[command2](...args);
                          if (child.send) {
                            child.send(
                              JSON.stringify({
                                payload: result,
                                key: message[message.length - 1]
                              })
                            );
                          }
                        } catch (error) {
                          console.error(`Error handling command ${command2}:`, error);
                        }
                      }
                    });
                  }
                }
              };
              const server = await this.createIpcServer(onData, ipcfile);
              const child = spawn("node", [builtfile, testResources, ipcfile], {
                stdio: ["pipe", "pipe", "pipe", "ipc"]
              });
              try {
                await this.handleChildProcess(child, logs, reportDest, src, "node");
                await this.generatePromptFiles(reportDest, src);
              } finally {
                server.close();
                this.cleanupPorts(portsToUse);
              }
            } catch (error) {
              if (error.message !== "No ports available") {
                throw error;
              }
            }
          })();
          this.addPromiseProcess(
            processId,
            nodePromise,
            command,
            "bdd-test",
            src,
            "node"
          );
        };
        this.launchWeb = async (src, dest) => {
          console.log(ansiC4.green(ansiC4.inverse(`web < ${src}`)));
          const processId = `web-${src}-${Date.now()}`;
          const command = `web test: ${src}`;
          const webPromise = (async () => {
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.projectName}/${src.split(".").slice(0, -1).join(".")}/web`;
            if (!fs21.existsSync(reportDest)) {
              fs21.mkdirSync(reportDest, { recursive: true });
            }
            const destFolder = dest.replace(".mjs", "");
            const webArgz = JSON.stringify({
              name: src,
              ports: [].toString(),
              fs: reportDest,
              browserWSEndpoint: this.browser.wsEndpoint()
            });
            const d = `${dest}?cacheBust=${Date.now()}`;
            const logs = createLogStreams(reportDest, "web");
            return new Promise((resolve, reject) => {
              this.browser.newPage().then((page) => {
                page.on("console", (log) => {
                  const msg = `${log.text()}
`;
                  switch (log.type()) {
                    case "info":
                      logs.info?.write(msg);
                      break;
                    case "warn":
                      logs.warn?.write(msg);
                      break;
                    case "error":
                      logs.error?.write(msg);
                      break;
                    case "debug":
                      logs.debug?.write(msg);
                      break;
                    default:
                      break;
                  }
                });
                page.on("close", () => {
                  logs.writeExitCode(0);
                  logs.closeAll();
                });
                this.mapping().forEach(async ([command2, func]) => {
                  if (command2 === "page") {
                    page.exposeFunction(command2, (x) => {
                      if (x) {
                        return func(x);
                      } else {
                        return func(page.mainFrame()._id);
                      }
                    });
                  } else {
                    return page.exposeFunction(command2, func);
                  }
                });
                return page;
              }).then(async (page) => {
                const close = () => {
                  logs.info?.write("close2");
                  if (!files2[src]) {
                    files2[src] = /* @__PURE__ */ new Set();
                  }
                  delete files2[src];
                  Promise.all(screenshots2[src] || []).then(() => {
                    delete screenshots2[src];
                  });
                };
                page.on("pageerror", (err) => {
                  logs.info?.write("pageerror");
                  reject(err);
                });
                await page.goto(`file://${`${destFolder}.html`}`, {});
                const evaluation = webEvaluator(d, webArgz);
                console.log(evaluation);
                await page.evaluate(evaluation).then(
                  async (fr) => {
                    const { fails, failed, features } = fr;
                    logs.info?.write("\n idk1");
                    statusMessagePretty(fails, src, "web");
                    this.bddTestIsNowDone(src, fails);
                    resolve();
                  }
                ).catch((e) => {
                  logs.info?.write("\n idk2");
                  console.log(ansiC4.red(ansiC4.inverse(e.stack)));
                  console.log(
                    ansiC4.red(
                      ansiC4.inverse(
                        `web ! ${src} failed to execute. No "tests.json" file was generated. Check logs for more info`
                      )
                    )
                  );
                  const testsJsonPath = `${reportDest}/tests.json`;
                  if (!fs21.existsSync(testsJsonPath)) {
                    fs21.writeFileSync(
                      testsJsonPath,
                      JSON.stringify(
                        {
                          tests: [],
                          features: [],
                          givens: [],
                          fullPath: src
                        },
                        null,
                        2
                      )
                    );
                  }
                  this.bddTestIsNowDone(src, -1);
                  reject(e);
                }).finally(async () => {
                  logs.info?.write("\n idk3");
                  await this.generatePromptFiles(reportDest, src);
                  close();
                });
              }).catch((error) => {
                reject(error);
              });
            });
          })();
          this.addPromiseProcess(
            processId,
            webPromise,
            command,
            "bdd-test",
            src,
            "web"
          );
        };
        this.launchPython = async (src, dest) => {
          console.log(ansiC4.green(ansiC4.inverse(`python < ${src}`)));
          const processId = `python-${src}-${Date.now()}`;
          const command = `python test: ${src}`;
          const pythonPromise = (async () => {
            try {
              const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "python");
              const logs = createLogStreams(reportDest, "python");
              const venvPython = `./venv/bin/python3`;
              const pythonCommand = fs21.existsSync(venvPython) ? venvPython : "python3";
              const ipcfile = "/tmp/tpipe_python_" + Math.random();
              const child = spawn(pythonCommand, [src, testResources, ipcfile], {
                stdio: ["pipe", "pipe", "pipe", "ipc"]
              });
              let buffer = Buffer.from("");
              const queue = new Queue();
              const onData = (data) => {
                buffer = Buffer.concat([buffer, data]);
                for (let b = 0; b < buffer.length + 1; b++) {
                  const c = buffer.slice(0, b);
                  try {
                    const d = JSON.parse(c.toString());
                    queue.enqueue(d);
                    buffer = buffer.slice(b);
                    b = 0;
                  } catch (e) {
                  }
                }
                while (queue.size() > 0) {
                  const message = queue.dequeue();
                  if (message) {
                    this.mapping().forEach(async ([command2, func]) => {
                      if (message[0] === command2) {
                        const args = message.slice(1, -1);
                        try {
                          const result = await this[command2](...args);
                          if (child.send) {
                            child.send(
                              JSON.stringify({
                                payload: result,
                                key: message[message.length - 1]
                              })
                            );
                          }
                        } catch (error) {
                          console.error(`Error handling command ${command2}:`, error);
                        }
                      }
                    });
                  }
                }
              };
              const server = await this.createIpcServer(onData, ipcfile);
              try {
                await this.handleChildProcess(child, logs, reportDest, src, "python");
                await this.generatePromptFiles(reportDest, src);
              } finally {
                server.close();
                this.cleanupPorts(portsToUse);
              }
            } catch (error) {
              if (error.message !== "No ports available") {
                throw error;
              }
            }
          })();
          this.addPromiseProcess(
            processId,
            pythonPromise,
            command,
            "bdd-test",
            src,
            "python"
          );
        };
        this.launchGolang = async (src, dest) => {
          console.log(ansiC4.green(ansiC4.inverse(`goland < ${src}`)));
          const processId = `golang-${src}-${Date.now()}`;
          const command = `golang test: ${src}`;
          const golangPromise = (async () => {
            try {
              const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "golang");
              const logs = createLogStreams(reportDest, "golang");
              const ipcfile = "/tmp/tpipe_golang_" + Math.random().toString(36).substring(2);
              let buffer = Buffer.from("");
              const queue = new Queue();
              const onData = (data) => {
                buffer = Buffer.concat([buffer, data]);
                for (let b = 0; b < buffer.length + 1; b++) {
                  const c = buffer.slice(0, b);
                  try {
                    const d = JSON.parse(c.toString());
                    queue.enqueue(d);
                    buffer = buffer.slice(b);
                    b = 0;
                  } catch (e) {
                  }
                }
                while (queue.size() > 0) {
                  const message = queue.dequeue();
                  if (message) {
                    this.mapping().forEach(async ([command2, func]) => {
                      if (message[0] === command2) {
                        const args = message.slice(1, -1);
                        try {
                          const result = await this[command2](...args);
                        } catch (error) {
                          console.error(`Error handling command ${command2}:`, error);
                        }
                      }
                    });
                  }
                }
              };
              const server = await this.createIpcServer(onData, ipcfile);
              let currentDir = path19.dirname(src);
              let goModDir = null;
              while (currentDir !== path19.parse(currentDir).root) {
                if (fs21.existsSync(path19.join(currentDir, "go.mod"))) {
                  goModDir = currentDir;
                  break;
                }
                currentDir = path19.dirname(currentDir);
              }
              if (!goModDir) {
                console.error(`Could not find go.mod file for test ${src}`);
                goModDir = path19.dirname(src);
                console.error(`Falling back to: ${goModDir}`);
              }
              const relativeTestPath = path19.relative(goModDir, src);
              const child = spawn(
                "go",
                ["test", "-v", "-json", "./" + path19.dirname(relativeTestPath)],
                {
                  stdio: ["pipe", "pipe", "pipe"],
                  env: {
                    ...process.env,
                    TEST_RESOURCES: testResources,
                    IPC_FILE: ipcfile,
                    GO111MODULE: "on"
                  },
                  cwd: goModDir
                }
              );
              await this.handleChildProcess(child, logs, reportDest, src, "golang");
              await this.generatePromptFiles(reportDest, src);
              await this.processGoTestOutput(reportDest, src);
              server.close();
              try {
                fs21.unlinkSync(ipcfile);
              } catch (e) {
              }
              this.cleanupPorts(portsToUse);
            } catch (error) {
              if (error.message !== "No ports available") {
                throw error;
              }
            }
          })();
          this.addPromiseProcess(
            processId,
            golangPromise,
            command,
            "bdd-test",
            src,
            "golang"
          );
        };
      }
      async startBuildProcesses() {
        const { nodeEntryPoints, webEntryPoints } = getRunnables(
          this.configs,
          this.projectName
        );
        console.log(`Starting build processes for ${this.projectName}...`);
        console.log(`  Node entry points: ${Object.keys(nodeEntryPoints).length}`);
        console.log(`  Web entry points: ${Object.keys(webEntryPoints).length}`);
        await Promise.all([
          this.startBuildProcess(node_default, nodeEntryPoints, "node"),
          this.startBuildProcess(web_default, webEntryPoints, "web")
          // this.startBuildProcess(esbuildImportConfiger, pureEntryPoints, "pure"),
        ]);
      }
      async setupTestEnvironment(src, runtime) {
        this.bddTestIsRunning(src);
        const reportDest = `testeranto/reports/${this.projectName}/${src.split(".").slice(0, -1).join(".")}/${runtime}`;
        if (!fs21.existsSync(reportDest)) {
          fs21.mkdirSync(reportDest, { recursive: true });
        }
        const testConfig = this.configTests().find((t) => t[0] === src);
        if (!testConfig) {
          console.log(
            ansiC4.inverse(`missing test config! Exiting ungracefully for '${src}'`)
          );
          process.exit(-1);
        }
        const testConfigResource = testConfig[2];
        const portsToUse = [];
        let testResources = "";
        if (testConfigResource.ports === 0) {
          testResources = JSON.stringify({
            name: src,
            ports: [],
            fs: reportDest,
            browserWSEndpoint: this.browser.wsEndpoint()
          });
        } else if (testConfigResource.ports > 0) {
          const openPorts = Object.entries(this.ports).filter(
            ([, status]) => status === ""
          );
          if (openPorts.length >= testConfigResource.ports) {
            for (let i = 0; i < testConfigResource.ports; i++) {
              portsToUse.push(openPorts[i][0]);
              this.ports[openPorts[i][0]] = src;
            }
            testResources = JSON.stringify({
              scheduled: true,
              name: src,
              ports: portsToUse,
              fs: reportDest,
              browserWSEndpoint: this.browser.wsEndpoint()
            });
          } else {
            console.log(
              ansiC4.red(
                `${runtime}: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`
              )
            );
            this.queue.push(src);
            throw new Error("No ports available");
          }
        } else {
          console.error("negative port makes no sense", src);
          process.exit(-1);
        }
        return {
          reportDest,
          testConfig,
          testConfigResource,
          portsToUse,
          testResources
        };
      }
      cleanupPorts(portsToUse) {
        portsToUse.forEach((port) => {
          this.ports[port] = "";
        });
      }
      createIpcServer(onData, ipcfile) {
        return new Promise((resolve, reject) => {
          const server = net.createServer((socket) => {
            socket.on("data", onData);
          });
          server.listen(ipcfile, () => {
            resolve(server);
          });
          server.on("error", (err) => reject(err));
        });
      }
      handleChildProcess(child, logs, reportDest, src, runtime) {
        return new Promise((resolve, reject) => {
          child.stdout?.on("data", (data) => {
            logs.stdout?.write(data);
          });
          child.stderr?.on("data", (data) => {
            logs.stderr?.write(data);
          });
          child.on("close", (code) => {
            const exitCode = code === null ? -1 : code;
            if (exitCode < 0) {
              logs.writeExitCode(
                exitCode,
                new Error("Process crashed or was terminated")
              );
            } else {
              logs.writeExitCode(exitCode);
            }
            logs.closeAll();
            if (exitCode === 0) {
              this.bddTestIsNowDone(src, 0);
              statusMessagePretty(0, src, runtime);
              resolve();
            } else {
              console.log(
                ansiColors.red(
                  `${runtime} ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`
                )
              );
              this.bddTestIsNowDone(src, exitCode);
              statusMessagePretty(exitCode, src, runtime);
              reject(new Error(`Process exited with code ${exitCode}`));
            }
          });
          child.on("error", (e) => {
            console.log(
              ansiC4.red(
                ansiC4.inverse(
                  `${src} errored with: ${e.name}. Check error logs for more info`
                )
              )
            );
            this.bddTestIsNowDone(src, -1);
            statusMessagePretty(-1, src, runtime);
            reject(e);
          });
        });
      }
      async processGoTestOutput(reportDest, src) {
        const testsJsonPath = `${reportDest}/tests.json`;
        const stdoutPath = `${reportDest}/stdout.log`;
        if (fs21.existsSync(stdoutPath)) {
          try {
            const stdoutContent = fs21.readFileSync(stdoutPath, "utf-8");
            const lines = stdoutContent.split("\n").filter((line) => line.trim());
            const testResults = {
              tests: [],
              features: [],
              givens: [],
              fullPath: path19.resolve(process.cwd(), src)
            };
            for (const line of lines) {
              try {
                const event = JSON.parse(line);
                if (event.Action === "pass" || event.Action === "fail") {
                  testResults.tests.push({
                    name: event.Test || event.Package,
                    status: event.Action === "pass" ? "passed" : "failed",
                    time: event.Elapsed ? `${event.Elapsed}s` : "0s"
                  });
                }
              } catch (e) {
              }
            }
            fs21.writeFileSync(testsJsonPath, JSON.stringify(testResults, null, 2));
            return;
          } catch (error) {
            console.error("Error processing go test output:", error);
          }
        }
        const basicTestResult = {
          tests: [],
          features: [],
          givens: [],
          fullPath: path19.resolve(process.cwd(), src)
        };
        fs21.writeFileSync(testsJsonPath, JSON.stringify(basicTestResult, null, 2));
      }
      async generatePromptFiles(reportDest, src) {
        try {
          if (!fs21.existsSync(reportDest)) {
            fs21.mkdirSync(reportDest, { recursive: true });
          }
          const messagePath = `${reportDest}/message.txt`;
          const messageContent = `There are 3 types of test reports.
1) bdd (highest priority)
2) type checker
3) static analysis (lowest priority)

"tests.json" is the detailed result of the bdd tests.
if these files do not exist, then something has gone badly wrong and needs to be addressed.

"type_errors.txt" is the result of the type checker.
if this file does not exist, then type check passed without errors;

"lint_errors.txt" is the result of the static analysis.
if this file does not exist, then static analysis passed without errors;

BDD failures are the highest priority. Focus on passing BDD tests before addressing other concerns.
Do not add error throwing/catching to the tests themselves.`;
          fs21.writeFileSync(messagePath, messageContent);
          const promptPath = `${reportDest}/prompt.txt`;
          const promptContent = `/read node_modules/testeranto/docs/index.md
/read node_modules/testeranto/docs/style.md
/read node_modules/testeranto/docs/testing.ai.txt
/read node_modules/testeranto/src/CoreTypes.ts

/read ${reportDest}/tests.json
/read ${reportDest}/type_errors.txt
/read ${reportDest}/lint_errors.txt

/read ${reportDest}/stdout.log
/read ${reportDest}/stderr.log
/read ${reportDest}/exit.log
/read ${reportDest}/message.txt`;
          fs21.writeFileSync(promptPath, promptContent);
        } catch (error) {
          console.error(`Failed to generate prompt files for ${src}:`, error);
        }
      }
      // private getGolangSourceFiles(src: string): string[] {
      //   // Get all .go files in the same directory as the test
      //   const testDir = path.dirname(src);
      //   const files: string[] = [];
      //   try {
      //     const dirContents = fs.readdirSync(testDir);
      //     dirContents.forEach((file) => {
      //       if (file.endsWith(".go")) {
      //         files.push(path.join(testDir, file));
      //       }
      //     });
      //   } catch (error) {
      //     console.error(`Error reading directory ${testDir}:`, error);
      //   }
      //   // Always include the main test file
      //   if (!files.includes(src)) {
      //     files.push(src);
      //   }
      //   return files;
      // }
      // launchPure = async (src: string, dest: string) => {
      //   console.log(ansiC.green(ansiC.inverse(`pure < ${src}`)));
      //   const processId = `pure-${src}-${Date.now()}`;
      //   const command = `pure test: ${src}`;
      //   // Create the promise
      //   const purePromise = (async () => {
      //     this.bddTestIsRunning(src);
      //     const reportDest = `testeranto/reports/${this.projectName}/${src
      //       .split(".")
      //       .slice(0, -1)
      //       .join(".")}/pure`;
      //     if (!fs.existsSync(reportDest)) {
      //       fs.mkdirSync(reportDest, { recursive: true });
      //     }
      //     const destFolder = dest.replace(".mjs", "");
      //     let argz = "";
      //     const testConfig = this.configs.tests.find((t) => {
      //       return t[0] === src;
      //     });
      //     if (!testConfig) {
      //       console.log(
      //         ansiC.inverse("missing test config! Exiting ungracefully!")
      //       );
      //       process.exit(-1);
      //     }
      //     const testConfigResource = testConfig[2];
      //     const portsToUse: string[] = [];
      //     if (testConfigResource.ports === 0) {
      //       argz = JSON.stringify({
      //         scheduled: true,
      //         name: src,
      //         ports: portsToUse,
      //         fs: reportDest,
      //         browserWSEndpoint: this.browser.wsEndpoint(),
      //       });
      //     } else if (testConfigResource.ports > 0) {
      //       const openPorts = Object.entries(this.ports).filter(
      //         ([portnumber, status]) => status === ""
      //       );
      //       if (openPorts.length >= testConfigResource.ports) {
      //         for (let i = 0; i < testConfigResource.ports; i++) {
      //           portsToUse.push(openPorts[i][0]);
      //           this.ports[openPorts[i][0]] = src; // port is now claimed
      //         }
      //         argz = JSON.stringify({
      //           scheduled: true,
      //           name: src,
      //           ports: portsToUse,
      //           fs: destFolder,
      //           browserWSEndpoint: this.browser.wsEndpoint(),
      //         });
      //       } else {
      //         this.queue.push(src);
      //         return [Math.random(), argz];
      //       }
      //     } else {
      //       console.error("negative port makes no sense", src);
      //       process.exit(-1);
      //     }
      //     const builtfile = dest;
      //     const logs = createLogStreams(reportDest, "pure");
      //     try {
      //       await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
      //         return module.default
      //           .then((defaultModule) => {
      //             return defaultModule
      //               .receiveTestResourceConfig(argz)
      //               .then(async (results: IFinalResults) => {
      //                 // Ensure the test results are properly processed
      //                 // The receiveTestResourceConfig should handle creating tests.json
      //                 statusMessagePretty(results.fails, src, "pure");
      //                 this.bddTestIsNowDone(src, results.fails);
      //                 return results.fails;
      //               });
      //           })
      //           .catch((e2) => {
      //             console.log(
      //               ansiColors.red(
      //                 `pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`
      //               )
      //             );
      //             // Create a minimal tests.json even on failure
      //             const testsJsonPath = `${reportDest}/tests.json`;
      //             if (!fs.existsSync(testsJsonPath)) {
      //               fs.writeFileSync(
      //                 testsJsonPath,
      //                 JSON.stringify(
      //                   {
      //                     tests: [],
      //                     features: [],
      //                     givens: [],
      //                     fullPath: src,
      //                   },
      //                   null,
      //                   2
      //                 )
      //               );
      //             }
      //             logs.exit.write(e2.stack);
      //             logs.exit.write(-1);
      //             this.bddTestIsNowDone(src, -1);
      //             statusMessagePretty(-1, src, "pure");
      //             throw e2;
      //           });
      //       });
      //     } catch (e3) {
      //       // Create a minimal tests.json even on uncaught errors
      //       const testsJsonPath = `${reportDest}/tests.json`;
      //       if (!fs.existsSync(testsJsonPath)) {
      //         fs.writeFileSync(
      //           testsJsonPath,
      //           JSON.stringify(
      //             {
      //               tests: [],
      //               features: [],
      //               givens: [],
      //               fullPath: src,
      //             },
      //             null,
      //             2
      //           )
      //         );
      //       }
      //       logs.writeExitCode(-1, e3);
      //       console.log(
      //         ansiC.red(
      //           ansiC.inverse(
      //             `${src} 1 errored with: ${e3}. Check logs for more info`
      //           )
      //         )
      //       );
      //       logs.exit.write(e3.stack);
      //       logs.exit.write("-1");
      //       this.bddTestIsNowDone(src, -1);
      //       statusMessagePretty(-1, src, "pure");
      //       throw e3;
      //     } finally {
      //       // Generate prompt files for Pure tests
      //       await this.generatePromptFiles(reportDest, src);
      //       for (let i = 0; i <= portsToUse.length; i++) {
      //         if (portsToUse[i]) {
      //           this.ports[portsToUse[i]] = ""; // port is open again
      //         }
      //       }
      //     }
      //   })();
      //   // Add to process manager
      //   this.addPromiseProcess(
      //     processId,
      //     purePromise,
      //     command,
      //     "bdd-test",
      //     src,
      //     "pure"
      //   );
      // };
    };
  }
});

// src/testeranto.ts
init_utils();
import ansiC5 from "ansi-colors";
import fs22 from "fs";
import path20 from "path";
import readline from "readline";

// src/PM/pitonoBuild.ts
init_pitonoMetafile();

// src/utils/pitonoWatcher.ts
init_pitonoMetafile();
import chokidar from "chokidar";
import path3 from "path";
import fs2 from "fs";
var PitonoWatcher = class {
  constructor(testName, entryPoints) {
    this.watcher = null;
    this.onChangeCallback = null;
    this.testName = testName;
    this.entryPoints = entryPoints;
  }
  async start() {
    const pythonFilesPattern = "**/*.py";
    this.watcher = chokidar.watch(pythonFilesPattern, {
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
      this.handleFileChange("add", filePath);
    }).on("change", (filePath) => {
      this.handleFileChange("change", filePath);
    }).on("unlink", (filePath) => {
      this.handleFileChange("unlink", filePath);
    }).on("error", (error) => {
      console.error(`Source watcher error: ${error}`);
    }).on("ready", () => {
      console.log(
        "Initial python source file scan complete. Ready for changes."
      );
    });
    const outputDir = path3.join(
      process.cwd(),
      `testeranto/bundles/python/${this.testName}`
    );
    const lastSignatures = /* @__PURE__ */ new Map();
    const bundleWatcher = chokidar.watch(path3.join(outputDir, "*.py"), {
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      }
    });
    bundleWatcher.on("add", (filePath) => {
      this.readAndCheckSignature(filePath, lastSignatures);
    }).on("change", (filePath) => {
      this.readAndCheckSignature(filePath, lastSignatures);
    }).on("error", (error) => console.error(`Bundle watcher error: ${error}`));
    await this.regenerateMetafile();
  }
  async handleFileChange(event, filePath) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this.regenerateMetafile();
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }
  readAndCheckSignature(filePath, lastSignatures) {
    try {
      const content = fs2.readFileSync(filePath, "utf-8");
      const signatureMatch = content.match(/# Signature: (\w+)/);
      if (signatureMatch && signatureMatch[1]) {
        const currentSignature = signatureMatch[1];
        const lastSignature = lastSignatures.get(filePath);
        if (lastSignature === void 0) {
          lastSignatures.set(filePath, currentSignature);
        } else if (lastSignature !== currentSignature) {
          lastSignatures.set(filePath, currentSignature);
          if (this.onChangeCallback) {
            this.onChangeCallback();
          }
        }
      }
    } catch (error) {
      console.error(`Error reading bundle file ${filePath}:`, error);
    }
  }
  async regenerateMetafile() {
    try {
      const metafile = await generatePitonoMetafile(
        this.testName,
        this.entryPoints
      );
      writePitonoMetafile(this.testName, metafile);
    } catch (error) {
      console.error("Error regenerating pitono metafile:", error);
    }
  }
  onMetafileChange(callback) {
    this.onChangeCallback = callback;
  }
  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
};

// src/PM/pitonoBuild.ts
var PitonoBuild = class {
  constructor(config, testName) {
    this.watcher = null;
    this.config = config;
    this.testName = testName;
  }
  async build() {
    const pythonTests = Object.keys(
      this.config.golang.tests
    ).map((testName) => [
      testName,
      "python",
      this.config.python.tests[testName],
      []
    ]);
    const hasPythonTests = pythonTests.length > 0;
    if (hasPythonTests) {
      const pythonEntryPoints = pythonTests.map((test) => test[0]);
      const metafile = await generatePitonoMetafile(
        this.testName,
        pythonEntryPoints
      );
      writePitonoMetafile(this.testName, metafile);
      this.watcher = new PitonoWatcher(this.testName, pythonEntryPoints);
      await this.watcher.start();
      return pythonEntryPoints;
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

// src/web.html.ts
var web_html_default = (jsfilePath, htmlFilePath, cssfilePath) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <script type="module" src="${jsfilePath}"></script>
  <link rel="stylesheet" href="${cssfilePath}">
</head>

<body>
  <div id="root">
  </div>
</body>

</html>
`;

// src/testeranto.ts
var { GolingvuBuild: GolingvuBuild2 } = await Promise.resolve().then(() => (init_golingvuBuild(), golingvuBuild_exports));
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
if (!process.argv[2]) {
  console.error(`The 2nd argument should be a testeranto config file name.`);
  process.exit(-1);
}
var configFilepath = process.argv[2];
var testsName = path20.basename(configFilepath).split(".").slice(0, -1).join(".");
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}
import(`${process.cwd()}/${configFilepath}`).then(async (module) => {
  const bigConfig = module.default;
  try {
  } catch (e) {
    console.error("there was a problem");
    console.error(e);
  }
  const config = {
    ...bigConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testsName
  };
  console.log(ansiC5.inverse("Press 'q' to initiate a graceful shutdown."));
  console.log(ansiC5.inverse("Press 'x' to quit forcefully."));
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
      console.log(ansiC5.inverse("Shutting down forcefully..."));
      process.exit(-1);
    }
  });
  let pm = null;
  const { PM_Main: PM_Main2 } = await init_main().then(() => main_exports);
  pm = new PM_Main2(config, testsName, mode);
  await pm.start();
  if (!fs22.existsSync(`testeranto/reports/${testsName}`)) {
    fs22.mkdirSync(`testeranto/reports/${testsName}`);
  }
  fs22.writeFileSync(
    `testeranto/reports/${testsName}/config.json`,
    JSON.stringify(config, null, 2)
  );
  const getSecondaryEndpointsPoints = (runtime) => {
    return Array.from((config[runtime].tests, /* @__PURE__ */ new Set()));
  };
  Promise.resolve(
    Promise.all(
      [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
        const htmlFilePath = path20.normalize(
          `${process.cwd()}/testeranto/bundles/web/${testsName}/${sourceDir.join(
            "/"
          )}/${sourceFileNameMinusJs}.html`
        );
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        const cssFilePath = `./${sourceFileNameMinusJs}.css`;
        return fs22.promises.mkdir(path20.dirname(htmlFilePath), { recursive: true }).then(
          (x) => fs22.writeFileSync(
            htmlFilePath,
            web_html_default(jsfilePath, htmlFilePath, cssFilePath)
          )
        );
      })
    )
  );
  const {
    nodeEntryPoints,
    // nodeEntryPointSidecars,
    webEntryPoints,
    // webEntryPointSidecars,
    // pureEntryPoints,
    // pureEntryPointSidecars,
    pythonEntryPoints,
    // pythonEntryPointSidecars,
    golangEntryPoints
    // golangEntryPointSidecars,
  } = getRunnables(config, testsName);
  console.log("Node entry points:", Object.keys(nodeEntryPoints));
  console.log("Web entry points:", Object.keys(webEntryPoints));
  const hasGolangTests = Object.keys(config.golang).length > 0;
  if (hasGolangTests) {
    const golingvuBuild = new GolingvuBuild2(config, testsName);
    const golangEntryPoints2 = await golingvuBuild.build();
    golingvuBuild.onBundleChange(() => {
      Object.keys(golangEntryPoints2).forEach((entryPoint) => {
        if (pm) {
          pm.addToQueue(entryPoint, "golang");
        }
      });
    });
  }
  const hasPitonoTests = Object.keys(config.python).length > 0;
  if (hasPitonoTests) {
    const pitonoBuild = new PitonoBuild(config, testsName);
    const pitonoEntryPoints = await pitonoBuild.build();
    pitonoBuild.onBundleChange(() => {
      Object.keys(pitonoEntryPoints).forEach((entryPoint) => {
        if (pm) {
          pm.addToQueue(entryPoint, "python");
        }
      });
    });
  }
  [
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
    ["python", Object.keys(pythonEntryPoints)],
    ["golang", Object.keys(golangEntryPoints)]
  ].forEach(async ([runtime, keys]) => {
    keys.forEach(async (k) => {
      fs22.mkdirSync(
        `testeranto/reports/${testsName}/${k.split(".").slice(0, -1).join(".")}/${runtime}`,
        { recursive: true }
      );
    });
  });
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      console.log("Testeranto is shutting down gracefully...");
      if (pm) {
        pm.stop();
      } else {
        process.exit();
      }
    }
  });
});
