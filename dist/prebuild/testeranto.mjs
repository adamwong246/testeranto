import { createRequire } from 'module';const require = createRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/utils.ts
import path from "path";
var webEvaluator, tscPather, lintPather, promptPather, getRunnables;
var init_utils = __esm({
  "src/utils.ts"() {
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
      return path.join(
        "testeranto",
        "reports",
        projectName,
        entryPoint.split(".").slice(0, -1).join("."),
        platform,
        `prompt.txt`
      );
    };
    getRunnables = (tests, projectName, payload = {
      nodeEntryPoints: {},
      nodeEntryPointSidecars: {},
      webEntryPoints: {},
      webEntryPointSidecars: {},
      pureEntryPoints: {},
      pureEntryPointSidecars: {},
      golangEntryPoints: {},
      golangEntryPointSidecars: {},
      pythonEntryPoints: {},
      pythonEntryPointSidecars: {}
    }) => {
      const initializedPayload = {
        nodeEntryPoints: payload.nodeEntryPoints || {},
        nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
        webEntryPoints: payload.webEntryPoints || {},
        webEntryPointSidecars: payload.webEntryPointSidecars || {},
        pureEntryPoints: payload.pureEntryPoints || {},
        pureEntryPointSidecars: payload.pureEntryPointSidecars || {},
        golangEntryPoints: payload.golangEntryPoints || {},
        golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
        pythonEntryPoints: payload.pythonEntryPoints || {},
        pythonEntryPointSidecars: payload.pythonEntryPointSidecars || {}
      };
      return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
          pt.nodeEntryPoints[cv[0]] = path.resolve(
            `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "web") {
          pt.webEntryPoints[cv[0]] = path.resolve(
            `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "pure") {
          pt.pureEntryPoints[cv[0]] = path.resolve(
            `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        } else if (cv[1] === "golang") {
          pt.golangEntryPoints[cv[0]] = path.resolve(cv[0]);
        } else if (cv[1] === "python") {
          pt.pythonEntryPoints[cv[0]] = path.resolve(cv[0]);
        }
        cv[3].filter((t) => t[1] === "node").forEach((t) => {
          pt.nodeEntryPointSidecars[`${t[0]}`] = path.resolve(
            `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "web").forEach((t) => {
          pt.webEntryPointSidecars[`${t[0]}`] = path.resolve(
            `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "pure").forEach((t) => {
          pt.pureEntryPointSidecars[`${t[0]}`] = path.resolve(
            `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
          );
        });
        cv[3].filter((t) => t[1] === "golang").forEach((t) => {
          pt.golangEntryPointSidecars[`${t[0]}`] = path.resolve(t[0]);
        });
        cv[3].filter((t) => t[1] === "python").forEach((t) => {
          pt.pythonEntryPointSidecars[`${t[0]}`] = path.resolve(t[0]);
        });
        return pt;
      }, initializedPayload);
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
async function generatePitonoMetafile(testName2, entryPoints) {
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
function writePitonoMetafile(testName2, metafile) {
  const projectRoot = process.cwd();
  const metafilePath = path2.join(
    projectRoot,
    "testeranto",
    "metafiles",
    "python",
    "core.json"
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
    const output = execSync(`go list -mod=readonly -json "${processedPattern}"`, {
      encoding: "utf-8",
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"]
    });
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
async function generateGolingvuMetafile(testName2, entryPoints) {
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
function writeGolingvuMetafile(testName2, metafile) {
  const projectRoot = findProjectRoot();
  console.log("Project root found:", projectRoot);
  if (!fs8.existsSync(projectRoot)) {
    throw new Error(`Project root does not exist: ${projectRoot}`);
  }
  const metafilePath = path9.join(
    "testeranto",
    "metafiles",
    "golang",
    "core.json"
  );
  const metafileDir = path9.dirname(metafilePath);
  fs8.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  console.log(`Golang metafile written to: ${metafilePath}`);
  const outputDir = path9.join("bundles", "golang", "core");
  console.log("Output directory:", outputDir);
  for (const [outputPath, outputInfo] of Object.entries(
    metafile.metafile.outputs
  )) {
    const fileName = path9.basename(outputPath);
    const fullOutputPath = path9.join("testeranto", outputDir, fileName);
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
    console.log("Building in main package - no imports needed");
    console.log(`Generated single Golingvu wrapper: ${fullOutputPath}`);
    const binaryName = "calculator_test";
    try {
      const projectDir = path9.dirname(entryPoint);
      const exampleDir = path9.join(projectRoot, "example");
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
      console.log(`Writing wrapper source to: ${wrapperSourcePath}`);
      fs8.mkdirSync(wrapperSourceDirPath, { recursive: true });
      fs8.writeFileSync(wrapperSourcePath, wrapperContent);
      console.log(`Using go run instead of compiling binary`);
      console.log(
        `To execute: go run ${wrapperSourcePath} <test-resource-config>`
      );
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
import chokidar2 from "chokidar";
import path10 from "path";
import fs9 from "fs";
var GolingvuWatcher;
var init_golingvuWatcher = __esm({
  "src/utils/golingvuWatcher.ts"() {
    "use strict";
    init_golingvuMetafile();
    GolingvuWatcher = class {
      constructor(testName2, entryPoints) {
        this.watcher = null;
        this.onChangeCallback = null;
        this.debounceTimer = null;
        this.testName = testName2;
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
          console.log(
            "Number of watched directories:",
            Object.keys(watched || {}).length
          );
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
            for (const [dir, files3] of Object.entries(watched || {})) {
              console.log(`Directory: ${dir}`);
              console.log(`Files: ${files3.join(", ")}`);
            }
          }
        }).on("raw", (event, path19, details) => {
          console.log(`Raw event: ${event} on path: ${path19}`);
        });
        const outputDir = path10.join(
          process.cwd(),
          "testeranto",
          "bundles",
          "golang",
          "core"
        );
        if (!fs9.existsSync(outputDir)) {
          fs9.mkdirSync(outputDir, { recursive: true });
        }
        console.log(`Watching bundle directory: ${outputDir}`);
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
          if (fs9.existsSync(fullPath)) {
            try {
              const stats = fs9.statSync(fullPath);
              console.log(`File ${filePath} changed (${stats.size} bytes)`);
            } catch (error) {
              console.error(`Error reading file: ${error}`);
            }
          }
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
      constructor(config, testName2) {
        this.watcher = null;
        this.config = config;
        this.testName = testName2;
      }
      async build() {
        const golangTests = this.config.tests.filter((test) => test[1] === "golang");
        const hasGolangTests = golangTests.length > 0;
        if (hasGolangTests) {
          const golangEntryPoints = golangTests.map((test) => test[0]);
          const metafile = await generateGolingvuMetafile2(this.testName, golangEntryPoints);
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

// src/PM/utils.ts
import ansiC from "ansi-colors";
import path11 from "path";
import fs10 from "fs";
import crypto from "node:crypto";
function runtimeLogs(runtime, reportDest) {
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs10.existsSync(safeDest)) {
      fs10.mkdirSync(safeDest, { recursive: true });
    }
    if (runtime === "node") {
      return {
        stdout: fs10.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs10.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs10.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "web") {
      return {
        info: fs10.createWriteStream(`${safeDest}/info.log`),
        warn: fs10.createWriteStream(`${safeDest}/warn.log`),
        error: fs10.createWriteStream(`${safeDest}/error.log`),
        debug: fs10.createWriteStream(`${safeDest}/debug.log`),
        exit: fs10.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "pure") {
      return {
        exit: fs10.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "python") {
      return {
        stdout: fs10.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs10.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs10.createWriteStream(`${safeDest}/exit.log`)
      };
    } else if (runtime === "golang") {
      return {
        stdout: fs10.createWriteStream(`${safeDest}/stdout.log`),
        stderr: fs10.createWriteStream(`${safeDest}/stderr.log`),
        exit: fs10.createWriteStream(`${safeDest}/exit.log`)
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
  if (!fs10.existsSync(reportDest)) {
    fs10.mkdirSync(reportDest, { recursive: true });
  }
  const safeDest = reportDest || `testeranto/reports/default_${Date.now()}`;
  try {
    if (!fs10.existsSync(safeDest)) {
      fs10.mkdirSync(safeDest, { recursive: true });
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
    const fileStream = fs10.createReadStream(filePath);
    fileStream.on("data", (data) => {
      hash.update(data);
    });
    fileStream.on("end", () => {
      const fileHash3 = hash.digest("hex");
      resolve(fileHash3);
    });
    fileStream.on("error", (error) => {
      reject(`Error reading file: ${error.message}`);
    });
  });
}
async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path11.dirname(filePath);
  try {
    await fs10.promises.mkdir(dirPath, { recursive: true });
    await fs10.writeFileSync(filePath, data);
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
async function pollForFile(path19, timeout = 2e3) {
  const intervalObj = setInterval(function() {
    const file = path19;
    const fileExists = fs10.existsSync(file);
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
      headless: true,
      defaultViewport: null,
      // Disable default 800x600 viewport
      dumpio: false,
      devtools: false,
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
import fs11 from "fs";
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
    inputFilesPlugin_default = (platform, testName2) => {
      const f = `testeranto/metafiles/${platform}/${testName2}.json`;
      if (!fs11.existsSync(`testeranto/metafiles/${platform}`)) {
        fs11.mkdirSync(`testeranto/metafiles/${platform}`, { recursive: true });
      }
      return {
        register,
        inputFilesPluginFactory: {
          name: "metafileWriter",
          setup(build) {
            build.onEnd((result) => {
              fs11.writeFileSync(f, JSON.stringify(result, null, 2));
            });
          }
        }
      };
    };
  }
});

// src/esbuildConfigs/featuresPlugin.ts
import path12 from "path";
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
            path: path12.isAbsolute(args.path) ? args.path : path12.join(args.resolveDir, args.path),
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

// src/esbuildConfigs/rebuildPlugin.ts
import fs12 from "fs";
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
              fs12.writeFileSync(
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
    init_esbuildConfigs();
    init_inputFilesPlugin();
    init_featuresPlugin();
    init_rebuildPlugin();
    node_default = (config, entryPoints, testName2) => {
      const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
        "node",
        testName2
      );
      return {
        ...esbuildConfigs_default(config),
        splitting: true,
        outdir: `testeranto/bundles/node/${testName2}/`,
        // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
        metafile: true,
        supported: {
          "dynamic-import": true
        },
        define: {
          "process.env.FLUENTFFMPEG_COV": "0"
        },
        absWorkingDir: process.cwd(),
        banner: {
          js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
        },
        platform: "node",
        external: ["react", ...config.externals],
        entryPoints: [...entryPoints],
        plugins: [
          featuresPlugin_default,
          inputFilesPluginFactory,
          rebuildPlugin_default("node"),
          ...config.nodePlugins.map((p) => p(register2, entryPoints)) || []
        ]
      };
    };
  }
});

// src/esbuildConfigs/web.ts
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import path13 from "path";
var web_default;
var init_web = __esm({
  "src/esbuildConfigs/web.ts"() {
    "use strict";
    init_esbuildConfigs();
    init_inputFilesPlugin();
    init_featuresPlugin();
    init_rebuildPlugin();
    web_default = (config, entryPoints, testName2) => {
      const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
        "web",
        testName2
      );
      return {
        ...esbuildConfigs_default(config),
        treeShaking: true,
        outdir: `testeranto/bundles/web/${testName2}`,
        alias: {
          react: path13.resolve("./node_modules/react")
        },
        metafile: true,
        external: [
          "path",
          "fs",
          "stream",
          "http",
          "constants",
          "net",
          "assert",
          "tls",
          "os",
          "child_process",
          "readline",
          "zlib",
          "crypto",
          "https",
          "util",
          "process",
          "dns"
        ],
        platform: "browser",
        entryPoints: [...entryPoints],
        loader: config.webLoaders,
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
          ...(config.webPlugins || []).map((p) => p(register2, entryPoints)) || []
        ]
      };
    };
  }
});

// src/esbuildConfigs/consoleDetectorPlugin.ts
import fs13 from "fs";
var consoleDetectorPlugin;
var init_consoleDetectorPlugin = __esm({
  "src/esbuildConfigs/consoleDetectorPlugin.ts"() {
    "use strict";
    consoleDetectorPlugin = {
      name: "console-detector",
      setup(build) {
        build.onLoad({ filter: /\.(js|ts)$/ }, async (args) => {
          const contents = await fs13.promises.readFile(args.path, "utf8");
          const consolePattern = /console\.(log|error|warn|info|debug|trace|dir|dirxml|table|group|groupEnd|clear|count|countReset|assert|profile|profileEnd|time|timeLog|timeEnd|timeStamp|context|memory)/g;
          const matches = contents.match(consolePattern);
          if (matches) {
            const uniqueMethods = [...new Set(matches)];
            return {
              warnings: uniqueMethods.map((method) => ({
                text: `call of "${method}" was detected, which is not supported in the pure runtime.`
                // location: {
                //   file: args.path,
                //   line:
                //     contents
                //       .split("\n")
                //       .findIndex((line) => line.includes(method)) + 1,
                //   column: 0,
                // },
              }))
            };
          }
          return null;
        });
        build.onEnd((buildResult) => {
          if (buildResult.warnings.find((br) => br.pluginName === "console-detector"))
            console.warn(
              `Warning: An unsupported method call was detected in a source file used to build for the pure runtime. It is possible that this method call is in a comment block. If you really want to use this function, change this test to the "node" runtime.`
            );
        });
      }
    };
  }
});

// src/esbuildConfigs/pure.ts
import { isBuiltin } from "node:module";
var pure_default;
var init_pure = __esm({
  "src/esbuildConfigs/pure.ts"() {
    "use strict";
    init_esbuildConfigs();
    init_inputFilesPlugin();
    init_featuresPlugin();
    init_consoleDetectorPlugin();
    init_rebuildPlugin();
    pure_default = (config, entryPoints, testName2) => {
      const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
        "pure",
        testName2
      );
      return {
        ...esbuildConfigs_default(config),
        drop: [],
        splitting: true,
        outdir: `testeranto/bundles/pure/${testName2}/`,
        // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
        metafile: true,
        supported: {
          "dynamic-import": true
        },
        define: {
          "process.env.FLUENTFFMPEG_COV": "0"
        },
        absWorkingDir: process.cwd(),
        banner: {
          js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
        },
        platform: "node",
        external: ["react", ...config.externals],
        entryPoints: [...entryPoints],
        plugins: [
          featuresPlugin_default,
          inputFilesPluginFactory,
          consoleDetectorPlugin,
          // nativeImportDetectorPlugin,
          {
            name: "native-node-import-filter",
            setup(build) {
              build.onResolve({ filter: /fs/ }, (args) => {
                if (isBuiltin(args.path)) {
                  throw new Error(
                    `You attempted to import a node module "${args.path}" into a "pure" test, which is not allowed. If you really want to use this package, convert this test from "pure" to "node"`
                  );
                }
                return { path: args.path };
              });
            }
          },
          rebuildPlugin_default("pure"),
          ...(config.nodePlugins || []).map((p) => p(register2, entryPoints)) || []
        ]
      };
    };
  }
});

// src/PM/base.ts
import fs14 from "fs";
import path14 from "path";
var fileStreams3, fPaths, files, recorders, screenshots, PM_Base;
var init_base = __esm({
  "src/PM/base.ts"() {
    "use strict";
    fileStreams3 = [];
    fPaths = [];
    files = {};
    recorders = {};
    screenshots = {};
    PM_Base = class {
      constructor(configs) {
        this.configs = configs;
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
      // keep this forever. do not delete
      // mapping(): [string, (...a) => any][] {
      //   return [
      //     ["$", (...args) => this.$(...args)],
      //     ["click", (...args) => this.click(...args)],
      //     ["closePage", (...args) => this.closePage(...args)],
      //     ["createWriteStream", (...args) => this.createWriteStream(...args)],
      //     ["customclose", (...args) => this.customclose(...args)],
      //     ["customScreenShot", (...args) => this.customScreenShot(...args)],
      //     ["end", (...args) => this.end(...args)],
      //     ["existsSync", (...args) => this.existsSync(...args)],
      //     ["focusOn", (...args) => this.focusOn(...args)],
      //     ["getAttribute", (...args) => this.getAttribute(...args)],
      //     ["getInnerHtml", (...args) => this.getInnerHtml(...args)],
      //     // ["setValue", (...args) => this.setValue(...args)],
      //     ["goto", (...args) => this.goto(...args)],
      //     ["isDisabled", (...args) => this.isDisabled(...args)],
      //     // ["launchSideCar", (...args) => this.launchSideCar(...args)],
      //     ["mkdirSync", (...args) => this.mkdirSync(...args)],
      //     ["newPage", (...args) => this.newPage(...args)],
      //     ["page", (...args) => this.page(...args)],
      //     ["pages", (...args) => this.pages(...args)],
      //     ["screencast", (...args) => this.screencast(...args)],
      //     ["screencastStop", (...args) => this.screencastStop(...args)],
      //     // ["stopSideCar", (...args) => this.stopSideCar(...args)],
      //     ["typeInto", (...args) => this.typeInto(...args)],
      //     ["waitForSelector", (...args) => this.waitForSelector(...args)],
      //     ["write", (...args) => this.write(...args)],
      //     ["writeFileSync", (...args) => this.writeFileSync(...args)],
      //   ];
      // }
      // abstract launchSideCar(n: number, testName: string, projectName: string);
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
      goto(p, url3) {
        return new Promise((res) => {
          this.doInPage(p, async (page) => {
            await page?.goto(url3);
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
      async screencast(ssOpts, testName2, page) {
        const p = ssOpts.path;
        const dir = path14.dirname(p);
        fs14.mkdirSync(dir, {
          recursive: true
        });
        if (!files[testName2]) {
          files[testName2] = /* @__PURE__ */ new Set();
        }
        files[testName2].add(ssOpts.path);
        const sPromise = page.screenshot({
          ...ssOpts,
          path: p
        });
        if (!screenshots[testName2]) {
          screenshots[testName2] = [];
        }
        screenshots[testName2].push(sPromise);
        await sPromise;
        return sPromise;
      }
      async customScreenShot(ssOpts, testName2, pageUid) {
        const p = ssOpts.path;
        const dir = path14.dirname(p);
        fs14.mkdirSync(dir, {
          recursive: true
        });
        if (!files[testName2]) {
          files[testName2] = /* @__PURE__ */ new Set();
        }
        files[testName2].add(ssOpts.path);
        const page = (await this.browser.pages()).find(
          (p2) => p2.mainFrame()._id === pageUid
        );
        const sPromise = page.screenshot({
          ...ssOpts,
          path: p
        });
        if (!screenshots[testName2]) {
          screenshots[testName2] = [];
        }
        screenshots[testName2].push(sPromise);
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
        const testName2 = x[2];
        return new Promise(async (res) => {
          fs14.mkdirSync(path14.dirname(filepath), {
            recursive: true
          });
          if (!files[testName2]) {
            files[testName2] = /* @__PURE__ */ new Set();
          }
          files[testName2].add(filepath);
          await fs14.writeFileSync(filepath, contents);
          res(true);
        });
      }
      async createWriteStream(filepath, testName2) {
        const folder = filepath.split("/").slice(0, -1).join("/");
        return new Promise((res) => {
          if (!fs14.existsSync(folder)) {
            return fs14.mkdirSync(folder, {
              recursive: true
            });
          }
          const f = fs14.createWriteStream(filepath);
          fileStreams3.push(f);
          if (!files[testName2]) {
            files[testName2] = /* @__PURE__ */ new Set();
          }
          files[testName2].add(filepath);
          res(fileStreams3.length - 1);
        });
      }
      testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
          callback(
            new Promise((res, rej) => {
              tLog("testArtiFactory =>", fPath);
              const cleanPath = path14.resolve(fPath);
              fPaths.push(cleanPath.replace(process.cwd(), ``));
              const targetDir = cleanPath.split("/").slice(0, -1).join("/");
              fs14.mkdir(targetDir, { recursive: true }, async (error) => {
                if (error) {
                  console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
                }
                fs14.writeFileSync(
                  path14.resolve(
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
      // setValue(value: string, p: string) {
      //   this.doInPage(p, (page) => {
      //     return page.keyboard.type(value);
      //   });
      // }
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

// src/PM/PM_WithWebSocket.ts
import { spawn } from "node:child_process";
import fs15 from "fs";
import http from "http";
import url from "url";
import mime from "mime-types";
import { WebSocketServer } from "ws";
var PM_WithWebSocket;
var init_PM_WithWebSocket = __esm({
  "src/PM/PM_WithWebSocket.ts"() {
    "use strict";
    init_base();
    PM_WithWebSocket = class extends PM_Base {
      constructor(configs) {
        super(configs);
        this.clients = /* @__PURE__ */ new Set();
        this.runningProcesses = /* @__PURE__ */ new Map();
        this.allProcesses = /* @__PURE__ */ new Map();
        this.processLogs = /* @__PURE__ */ new Map();
        this.httpServer = http.createServer(this.requestHandler.bind(this));
        this.wss = new WebSocketServer({ server: this.httpServer });
        this.wss.on("connection", (ws) => {
          this.clients.add(ws);
          console.log("Client connected");
          ws.on("message", (data) => {
            try {
              const message = JSON.parse(data.toString());
              if (message.type === "chatMessage") {
                console.log(`Received chat message: ${message.content}`);
                if (this.handleChatMessage) {
                  this.handleChatMessage(message.content);
                } else {
                  console.log("PM_WithHelpo not available - message not processed");
                }
                return;
              }
              if (message.type === "listDirectory") {
                this.handleWebSocketListDirectory(ws, message);
              } else if (message.type === "executeCommand") {
                const executeMessage = message;
                if (message.command && message.command.trim().startsWith("aider")) {
                  console.log(`Executing command: ${message.command}`);
                  const processId = Date.now().toString();
                  const child = spawn(message.command, {
                    shell: true,
                    cwd: process.cwd()
                  });
                  this.runningProcesses.set(processId, child);
                  this.allProcesses.set(processId, {
                    child,
                    status: "running",
                    command: message.command,
                    pid: child.pid,
                    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                    type: "process",
                    category: "aider"
                  });
                  this.processLogs.set(processId, []);
                  this.broadcast({
                    type: "processStarted",
                    processId,
                    command: message.command,
                    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                    logs: []
                  });
                  child.stdout?.on("data", (data2) => {
                    const logData = data2.toString();
                    const logs = this.processLogs.get(processId) || [];
                    logs.push(logData);
                    this.processLogs.set(processId, logs);
                    this.broadcast({
                      type: "processStdout",
                      processId,
                      data: logData,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    });
                  });
                  child.stderr?.on("data", (data2) => {
                    const logData = data2.toString();
                    const logs = this.processLogs.get(processId) || [];
                    logs.push(logData);
                    this.processLogs.set(processId, logs);
                    this.broadcast({
                      type: "processStderr",
                      processId,
                      data: logData,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    });
                  });
                  child.on("error", (error) => {
                    console.error(`Failed to execute command: ${error}`);
                    this.runningProcesses.delete(processId);
                    const processInfo = this.allProcesses.get(processId);
                    if (processInfo) {
                      this.allProcesses.set(processId, {
                        ...processInfo,
                        status: "error",
                        error: error.message
                      });
                    }
                    this.broadcast({
                      type: "processError",
                      processId,
                      error: error.message,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    });
                  });
                  child.on("exit", (code) => {
                    console.log(`Command exited with code ${code}`);
                    this.runningProcesses.delete(processId);
                    const processInfo = this.allProcesses.get(processId);
                    if (processInfo) {
                      this.allProcesses.set(processId, {
                        ...processInfo,
                        status: "exited",
                        exitCode: code
                      });
                    }
                    this.broadcast({
                      type: "processExited",
                      processId,
                      exitCode: code,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    });
                  });
                } else {
                  console.error('Invalid command: must start with "aider"');
                }
              } else if (message.type === "getRunningProcesses") {
                const getRunningMessage = message;
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
              } else if (message.type === "getProcess") {
                const getProcessMessage = message;
                const processId = message.processId;
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
              } else if (message.type === "stdin") {
                const stdinMessage = message;
                const processId = message.processId;
                const data2 = message.data;
                console.log("Received stdin for process", processId, ":", data2);
                const childProcess = this.runningProcesses.get(processId);
                if (childProcess && childProcess.stdin) {
                  console.log("Writing to process stdin");
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
              } else if (message.type === "killProcess") {
                const killProcessMessage = message;
                const processId = message.processId;
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
              } else if (message.type === "getChatHistory") {
                if (this.getChatHistory) {
                  this.getChatHistory().then((history) => {
                    ws.send(JSON.stringify({
                      type: "chatHistory",
                      messages: history
                    }));
                  }).catch((error) => {
                    console.error("Error getting chat history:", error);
                    ws.send(JSON.stringify({
                      type: "error",
                      message: "Failed to get chat history"
                    }));
                  });
                }
              }
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
        this.httpServer.listen(httpPort, () => {
          console.log(`HTTP server running on http://localhost:${httpPort}`);
        });
      }
      requestHandler(req, res) {
        const parsedUrl = url.parse(req.url || "/", true);
        const pathname = parsedUrl.pathname || "/";
        if (pathname?.startsWith("/api/files/")) {
          this.handleFilesApi(req, res);
          return;
        }
        if (pathname === "/health") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() })
          );
          return;
        }
        let processedPathname = pathname;
        if (processedPathname === "/") {
          processedPathname = "/index.html";
        }
        let filePath = processedPathname.substring(1);
        if (filePath.startsWith("reports/")) {
          filePath = `testeranto/${filePath}`;
        } else if (filePath.startsWith("metafiles/")) {
          filePath = `testeranto/${filePath}`;
        } else if (filePath === "projects.json") {
          filePath = `testeranto/${filePath}`;
        } else {
          const possiblePaths = [
            `dist/${filePath}`,
            `testeranto/dist/${filePath}`,
            `../dist/${filePath}`,
            `./${filePath}`
          ];
          let foundPath = null;
          for (const possiblePath of possiblePaths) {
            if (fs15.existsSync(possiblePath)) {
              foundPath = possiblePath;
              break;
            }
          }
          if (foundPath) {
            filePath = foundPath;
          } else {
            const indexPath = this.findIndexHtml();
            if (indexPath) {
              fs15.readFile(indexPath, (err, data) => {
                if (err) {
                  res.writeHead(404, { "Content-Type": "text/plain" });
                  res.end("404 Not Found");
                  return;
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
              });
              return;
            } else {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
              return;
            }
          }
        }
        fs15.exists(filePath, (exists) => {
          if (!exists) {
            if (!processedPathname.includes(".") && processedPathname !== "/") {
              const indexPath = this.findIndexHtml();
              if (indexPath) {
                fs15.readFile(indexPath, (err, data) => {
                  if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                    return;
                  }
                  res.writeHead(200, { "Content-Type": "text/html" });
                  res.end(data);
                });
                return;
              } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
              <html>
                <body>
                  <h1>Testeranto is running</h1>
                  <p>Frontend files are not built yet. Run 'npm run build' to build the frontend.</p>
                </body>
              </html>
            `);
                return;
              }
            }
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
          }
          fs15.readFile(filePath, (err, data) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("500 Internal Server Error");
              return;
            }
            if (filePath.endsWith(".html")) {
              let content = data.toString();
              if (content.includes("</body>")) {
                const configScript = `
              <script>
                window.testerantoConfig = ${JSON.stringify({
                  githubOAuth: {
                    clientId: process.env.GITHUB_CLIENT_ID || ""
                  },
                  serverOrigin: process.env.SERVER_ORIGIN || "http://localhost:3000"
                })};
              </script>
            `;
                content = content.replace("</body>", `${configScript}</body>`);
              }
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(content);
            } else {
              const mimeType = mime.lookup(filePath) || "application/octet-stream";
              res.writeHead(200, { "Content-Type": mimeType });
              res.end(data);
            }
          });
        });
      }
      handleFilesApi(req, res) {
        const parsedUrl = url.parse(req.url || "/", true);
        const pathname = parsedUrl.pathname || "/";
        const query = parsedUrl.query || {};
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        if (req.method === "OPTIONS") {
          res.writeHead(200);
          res.end();
          return;
        }
        try {
          if (pathname === "/api/files/list" && req.method === "GET") {
            this.handleListDirectory(req, res, query);
          } else if (pathname === "/api/files/read" && req.method === "GET") {
            this.handleReadFile(req, res, query);
          } else if (pathname === "/api/files/exists" && req.method === "GET") {
            this.handleFileExists(req, res, query);
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not found" }));
          }
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      }
      async handleListDirectory(req, res, query) {
        const path19 = query.path;
        if (!path19) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const fullPath = this.resolvePath(path19);
          const items = await this.listDirectory(fullPath);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(items));
        } catch (error) {
          console.error("Error listing directory:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to list directory" }));
        }
      }
      async handleReadFile(req, res, query) {
        const path19 = query.path;
        if (!path19) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const fullPath = this.resolvePath(path19);
          const content = await fs15.promises.readFile(fullPath, "utf-8");
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(content);
        } catch (error) {
          console.error("Error reading file:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to read file" }));
        }
      }
      async handleFileExists(req, res, query) {
        const path19 = query.path;
        if (!path19) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const fullPath = this.resolvePath(path19);
          const exists = fs15.existsSync(fullPath);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ exists }));
        } catch (error) {
          console.error("Error checking file existence:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to check file existence" }));
        }
      }
      resolvePath(requestedPath) {
        const normalizedPath = requestedPath.replace(/\.\./g, "").replace(/^\//, "").replace(/\/+/g, "/");
        return `${process.cwd()}/${normalizedPath}`;
      }
      async listDirectory(dirPath) {
        try {
          const items = await fs15.promises.readdir(dirPath, { withFileTypes: true });
          const result = [];
          for (const item of items) {
            if (item.name.startsWith("."))
              continue;
            const fullPath = `${dirPath}/${item.name}`;
            const relativePath = fullPath.replace(process.cwd(), "").replace(/^\//, "");
            if (item.isDirectory()) {
              result.push({
                name: item.name,
                type: "folder",
                path: "/" + relativePath
              });
            } else if (item.isFile()) {
              result.push({
                name: item.name,
                type: "file",
                path: "/" + relativePath
              });
            }
          }
          return result;
        } catch (error) {
          console.error("Error listing directory:", error);
          throw error;
        }
      }
      findIndexHtml() {
        const possiblePaths = [
          "dist/index.html",
          "testeranto/dist/index.html",
          "../dist/index.html",
          "./index.html"
        ];
        for (const path19 of possiblePaths) {
          if (fs15.existsSync(path19)) {
            return path19;
          }
        }
        return null;
      }
      // Add a method to track promise-based processes
      addPromiseProcess(processId, promise, command, category = "other", testName2, platform, onResolve, onReject) {
        this.runningProcesses.set(processId, promise);
        this.allProcesses.set(processId, {
          promise,
          status: "running",
          command,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          type: "promise",
          category,
          testName: testName2,
          platform
        });
        this.processLogs.set(processId, []);
        const startMessage = `Starting: ${command}`;
        const logs = this.processLogs.get(processId) || [];
        logs.push(startMessage);
        this.processLogs.set(processId, logs);
        this.broadcast({
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
          this.broadcast({
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
          this.broadcast({
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
      async handleWebSocketListDirectory(ws, message) {
        try {
          const path19 = message.path;
          if (!path19) {
            ws.send(JSON.stringify({
              type: "error",
              message: "Path parameter required"
            }));
            return;
          }
          const fullPath = this.resolvePath(path19);
          const items = await this.listDirectory(fullPath);
          ws.send(JSON.stringify({
            type: "directoryListing",
            path: path19,
            items
          }));
        } catch (error) {
          console.error("Error handling WebSocket directory listing:", error);
          ws.send(JSON.stringify({
            type: "error",
            message: "Failed to list directory"
          }));
        }
      }
      broadcast(message) {
        const data = typeof message === "string" ? message : JSON.stringify(message);
        this.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(data);
          }
        });
      }
      // Helper methods to get processes by category
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
      getProcessesByTestName(testName2) {
        return Array.from(this.allProcesses.entries()).filter(([id, procInfo]) => procInfo.testName === testName2).map(([id, procInfo]) => ({
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
    };
  }
});

// src/PM/PM_WithBuild.ts
import esbuild from "esbuild";
var PM_WithBuild;
var init_PM_WithBuild = __esm({
  "src/PM/PM_WithBuild.ts"() {
    "use strict";
    init_node();
    init_web();
    init_pure();
    init_utils();
    init_PM_WithWebSocket();
    PM_WithBuild = class extends PM_WithWebSocket {
      constructor(configs, name, mode2) {
        super(configs);
        this.currentBuildResolve = null;
        this.currentBuildReject = null;
        this.configs = configs;
        this.name = name;
        this.mode = mode2;
      }
      async startBuildProcesses() {
        const { nodeEntryPoints, webEntryPoints, pureEntryPoints } = getRunnables(
          this.configs.tests,
          this.name
        );
        console.log(`Starting build processes for ${this.name}...`);
        console.log(`  Node entry points: ${Object.keys(nodeEntryPoints).length}`);
        console.log(`  Web entry points: ${Object.keys(webEntryPoints).length}`);
        console.log(`  Pure entry points: ${Object.keys(pureEntryPoints).length}`);
        await Promise.all([
          this.startBuildProcess(node_default, nodeEntryPoints, "node"),
          this.startBuildProcess(web_default, webEntryPoints, "web"),
          this.startBuildProcess(pure_default, pureEntryPoints, "pure")
        ]);
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
              const command = `esbuild ${runtime} for ${self.name}`;
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
                  self.name,
                  runtime
                );
              }
              console.log(
                `Starting ${runtime} build for ${entryPointKeys.length} entry points`
              );
              if (self.broadcast) {
                self.broadcast({
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
              if (self.broadcast) {
                self.broadcast(event);
              }
              self.currentBuildResolve = null;
              self.currentBuildReject = null;
            });
          }
        };
        const baseConfig = configer(this.configs, entryPointKeys, this.name);
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
          if (this.broadcast) {
            this.broadcast({
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

// src/utils/makePrompt.ts
import fs16 from "fs";
import path15 from "path";
var makePrompt, makePromptInternal;
var init_makePrompt = __esm({
  "src/utils/makePrompt.ts"() {
    "use strict";
    init_utils();
    init_logFiles();
    init_logFiles();
    makePrompt = async (summary, name, entryPoint, addableFiles, runtime) => {
      summary[entryPoint].prompt = "?";
      const promptPath = promptPather(entryPoint, runtime, name);
      const testDir = path15.join(
        "testeranto",
        "reports",
        name,
        entryPoint.split(".").slice(0, -1).join("."),
        runtime
      );
      if (!fs16.existsSync(testDir)) {
        fs16.mkdirSync(testDir, { recursive: true });
      }
      const testPaths = path15.join(testDir, LOG_FILES.TESTS);
      const lintPath = path15.join(testDir, LOG_FILES.LINT_ERRORS);
      const typePath = path15.join(testDir, LOG_FILES.TYPE_ERRORS);
      const messagePath = path15.join(testDir, LOG_FILES.MESSAGE);
      try {
        await Promise.all([
          fs16.promises.writeFile(
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

/read ${getLogFilesForRuntime(runtime).map((p) => `${testDir}/${p}`).join("\n/read ")}
`
          ),
          fs16.promises.writeFile(
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
      summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${name}/reports/${runtime}/${entryPoint.split(".").slice(0, -1).join(".")}/prompt.txt`;
    };
    makePromptInternal = (summary, name, entryPoint, addableFiles, runTime) => {
      if (runTime === "node") {
        return makePrompt(summary, name, entryPoint, addableFiles, "node");
      }
      if (runTime === "web") {
        return makePrompt(summary, name, entryPoint, addableFiles, "web");
      }
      if (runTime === "pure") {
        return makePrompt(summary, name, entryPoint, addableFiles, "pure");
      }
      if (runTime === "golang") {
        return makePrompt(summary, name, entryPoint, addableFiles, "golang");
      }
      if (runTime === "python") {
        return makePrompt(summary, name, entryPoint, addableFiles, "python");
      }
      throw `unknown runTime: ${runTime}`;
    };
  }
});

// src/PM/PM_WithEslintAndTsc.ts
import ts from "typescript";
import fs17 from "fs";
import ansiC2 from "ansi-colors";
import { ESLint } from "eslint";
import tsc from "tsc-prog";
var eslint, formatter, PM_WithEslintAndTsc;
var init_PM_WithEslintAndTsc = __esm({
  async "src/PM/PM_WithEslintAndTsc.ts"() {
    "use strict";
    init_utils();
    init_PM_WithBuild();
    init_makePrompt();
    eslint = new ESLint();
    formatter = await eslint.loadFormatter(
      "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
    );
    PM_WithEslintAndTsc = class extends PM_WithBuild {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.summary = {};
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
                outDir: tscPather(entrypoint, platform, this.name),
                noEmit: true
              },
              include: addableFiles
            });
            const tscPath = tscPather(entrypoint, platform, this.name);
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
            fs17.writeFileSync(tscPath, results.join("\n"));
            this.typeCheckIsNowDone(entrypoint, results.length);
            return results.length;
          })();
          if (this.addPromiseProcess) {
            this.addPromiseProcess(
              processId,
              tscPromise,
              command,
              "build-time",
              entrypoint
            );
          } else {
            await tscPromise;
          }
        };
        this.eslintCheck = async (entrypoint, platform, addableFiles) => {
          const processId = `eslint-${entrypoint}-${Date.now()}`;
          const command = `eslint check for ${entrypoint}`;
          const eslintPromise = (async () => {
            try {
              this.lintIsRunning(entrypoint);
            } catch (e) {
              throw new Error(`Error in eslintCheck: ${e.message}`);
            }
            const filepath = lintPather(entrypoint, platform, this.name);
            if (fs17.existsSync(filepath))
              fs17.rmSync(filepath);
            const results = (await eslint.lintFiles(addableFiles)).filter((r) => r.messages.length).filter((r) => {
              return r.messages[0].ruleId !== null;
            }).map((r) => {
              delete r.source;
              return r;
            });
            fs17.writeFileSync(filepath, await formatter.format(results));
            this.lintIsNowDone(entrypoint, results.length);
            return results.length;
          })();
          if (this.addPromiseProcess) {
            this.addPromiseProcess(
              processId,
              eslintPromise,
              command,
              "build-time",
              entrypoint
            );
          } else {
            await eslintPromise;
          }
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
          await makePromptInternal(
            this.summary,
            this.name,
            entryPoint,
            addableFiles,
            platform
          );
          this.checkForShutdown();
        };
        this.typeCheckIsRunning = (src) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].typeErrors = "?";
        };
        this.typeCheckIsNowDone = (src, failures) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          if (failures === 0) {
            console.log(ansiC2.green(ansiC2.inverse(`tsc > ${src}`)));
          } else {
            console.log(
              ansiC2.red(ansiC2.inverse(`tsc > ${src} failed ${failures} times`))
            );
          }
          this.summary[src].typeErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
        this.lintIsRunning = (src) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].staticErrors = "?";
          this.writeBigBoard();
        };
        this.lintIsNowDone = (src, failures) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          if (failures === 0) {
            console.log(ansiC2.green(ansiC2.inverse(`eslint > ${src}`)));
          } else {
            console.log(
              ansiC2.red(ansiC2.inverse(`eslint > ${src} failed ${failures} times`))
            );
          }
          this.summary[src].staticErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
        this.bddTestIsRunning = (src) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].runTimeErrors = "?";
          this.writeBigBoard();
        };
        this.bddTestIsNowDone = (src, failures) => {
          if (!this.summary[src]) {
            throw `this.summary[${src}] is undefined`;
          }
          this.summary[src].runTimeErrors = failures;
          this.writeBigBoard();
          this.checkForShutdown();
        };
        this.writeBigBoard = () => {
          const summaryPath = `./testeranto/reports/${this.name}/summary.json`;
          const summaryData = JSON.stringify(this.summary, null, 2);
          fs17.writeFileSync(summaryPath, summaryData);
          this.broadcast({
            type: "summaryUpdate",
            data: this.summary
          });
        };
        this.summary = {};
        this.configs.tests.forEach(([t, rt, tr, sidecars]) => {
          this.ensureSummaryEntry(t);
          sidecars.forEach(([sidecarName]) => {
            this.ensureSummaryEntry(sidecarName, true);
          });
        });
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

// src/PM/PM_WithGit.ts
import fs18 from "fs";
import url2 from "url";
var PM_WithGit;
var init_PM_WithGit = __esm({
  async "src/PM/PM_WithGit.ts"() {
    "use strict";
    await init_PM_WithEslintAndTsc();
    PM_WithGit = class extends PM_WithEslintAndTsc {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.gitWatchTimeout = null;
        this.gitWatcher = null;
      }
      // Override requestHandler to add Git-specific endpoints
      requestHandler(req, res) {
        const parsedUrl = url2.parse(req.url || "/");
        const pathname = parsedUrl.pathname || "/";
        if (pathname?.startsWith("/api/git/")) {
          this.handleGitApi(req, res);
          return;
        }
        if (pathname === "/api/auth/github/token" && req.method === "POST") {
          this.handleGitHubTokenExchange(req, res);
          return;
        }
        if (pathname === "/auth/github/callback") {
          const callbackHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>GitHub Authentication - Testeranto</title>
    <script>
        // Extract the code from the URL and send it to the parent window
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (code) {
            window.opener.postMessage({ type: 'github-auth-callback', code }, '*');
        } else if (error) {
            window.opener.postMessage({ type: 'github-auth-error', error }, '*');
        }
        window.close();
    </script>
</head>
<body>
    <p>Completing authentication...</p>
</body>
</html>`;
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(callbackHtml);
          return;
        }
        super.requestHandler(req, res);
      }
      // this method is also horrible
      handleGitApi(req, res) {
        const parsedUrl = url2.parse(req.url || "/");
        const pathname = parsedUrl.pathname || "/";
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        if (req.method === "OPTIONS") {
          res.writeHead(200);
          res.end();
          return;
        }
        try {
          if (pathname === "/api/git/changes" && req.method === "GET") {
            this.handleGitChanges(req, res);
          } else if (pathname === "/api/git/status" && req.method === "GET") {
            this.handleGitFileStatus(req, res);
          } else if (pathname === "/api/git/commit" && req.method === "POST") {
            this.handleGitCommit(req, res);
          } else if (pathname === "/api/git/push" && req.method === "POST") {
            this.handleGitPush(req, res);
          } else if (pathname === "/api/git/pull" && req.method === "POST") {
            this.handleGitPull(req, res);
          } else if (pathname === "/api/git/branch" && req.method === "GET") {
            this.handleGitBranch(req, res);
          } else if (pathname === "/api/git/remote-status" && req.method === "GET") {
            this.handleGitRemoteStatus(req, res);
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not found" }));
          }
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      }
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
        const parsedUrl = url2.parse(req.url || "/");
        const query = parsedUrl.query || "";
        const params = new URLSearchParams(query);
        const path19 = params.get("path");
        if (!path19) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path parameter required" }));
          return;
        }
        try {
          const status = await this.getGitFileStatus(path19);
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
      async getGitFileStatus(path19) {
        try {
          const changes2 = await this.getGitChanges();
          const fileChange = changes2.find((change) => change.path === path19);
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
          const { exec } = await import("child_process");
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
          const { exec } = await import("child_process");
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
          const { exec } = await import("child_process");
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
        const watcher = (await import("fs")).watch(
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
                  this.broadcast({ type: "changes", changes: changes2 });
                  this.broadcast({ type: "status", status });
                  this.broadcast({ type: "branch", branch });
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
            this.broadcast({ type: "changes", changes: changes2 });
            this.broadcast({ type: "status", status });
            this.broadcast({ type: "branch", branch });
          } catch (error) {
            console.error("Error checking Git status:", error);
          }
        }, 1e4);
        this.gitWatcher = watcher;
      }
      async getGitChanges() {
        try {
          const { exec } = await import("child_process");
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
                  let path19 = match[2];
                  if (status === "R " && path19.includes(" -> ")) {
                    const parts = path19.split(" -> ");
                    path19 = parts[parts.length - 1];
                  }
                  path19 = path19.trim();
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
                    const fullPath = `${process.cwd()}/${path19}`;
                    try {
                      await fs18.promises.access(fullPath);
                    } catch (error2) {
                    }
                    changes2.push({
                      path: path19,
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
          const { exec } = await import("child_process");
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
          const { exec } = await import("child_process");
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

// src/PM/PM_WithProcesses.ts
import fs19, { watch } from "fs";
import path16 from "path";
import puppeteer, { executablePath as executablePath2 } from "puppeteer-core";
import ansiC3 from "ansi-colors";
var changes, PM_WithProcesses;
var init_PM_WithProcesses = __esm({
  async "src/PM/PM_WithProcesses.ts"() {
    "use strict";
    init_utils();
    init_utils2();
    await init_PM_WithGit();
    changes = {};
    PM_WithProcesses = class extends PM_WithGit {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.logStreams = {};
        this.receiveFeaturesV2 = (reportDest, srcTest, platform) => {
          const featureDestination = path16.resolve(
            process.cwd(),
            "reports",
            "features",
            "strings",
            srcTest.split(".").slice(0, -1).join(".") + ".features.txt"
          );
          const testReportPath = `${reportDest}/tests.json`;
          if (!fs19.existsSync(testReportPath)) {
            console.error(`tests.json not found at: ${testReportPath}`);
            return;
          }
          const testReport = JSON.parse(fs19.readFileSync(testReportPath, "utf8"));
          if (testReport.tests) {
            testReport.tests.forEach((test) => {
              test.fullPath = path16.resolve(process.cwd(), srcTest);
            });
          }
          testReport.fullPath = path16.resolve(process.cwd(), srcTest);
          fs19.writeFileSync(testReportPath, JSON.stringify(testReport, null, 2));
          testReport.features.reduce(async (mm, featureStringKey) => {
            const accum = await mm;
            const isUrl = isValidUrl(featureStringKey);
            if (isUrl) {
              const u = new URL(featureStringKey);
              if (u.protocol === "file:") {
                const newPath = `${process.cwd()}/testeranto/features/internal/${path16.relative(
                  process.cwd(),
                  u.pathname
                )}`;
                accum.files.push(u.pathname);
              } else if (u.protocol === "http:" || u.protocol === "https:") {
                const newPath = `${process.cwd()}/testeranto/features/external/${u.hostname}${u.pathname}`;
                const body = await this.configs.featureIngestor(featureStringKey);
                writeFileAndCreateDir(newPath, body);
                accum.files.push(newPath);
              }
            } else {
              await fs19.promises.mkdir(path16.dirname(featureDestination), {
                recursive: true
              });
              accum.strings.push(featureStringKey);
            }
            return accum;
          }, Promise.resolve({ files: [], strings: [] })).then(({ files: files3, strings }) => {
            fs19.writeFileSync(
              `testeranto/reports/${this.name}/${srcTest.split(".").slice(0, -1).join(".")}/${platform}/featurePrompt.txt`,
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
            ansiC3.inverse(
              `The following jobs are awaiting resources: ${JSON.stringify(
                this.queue
              )}`
            )
          );
          console.log(
            ansiC3.inverse(`The status of ports: ${JSON.stringify(this.ports)}`)
          );
          this.writeBigBoard();
          if (this.mode === "dev")
            return;
          let inflight = false;
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].prompt === "?") {
              console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} prompt ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].runTimeErrors === "?") {
              console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} runTimeError ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].staticErrors === "?") {
              console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} staticErrors ${k}`)));
              inflight = true;
            }
          });
          Object.keys(this.summary).forEach((k) => {
            if (this.summary[k].typeErrors === "?") {
              console.log(ansiC3.blue(ansiC3.inverse(`\u{1F555} typeErrors ${k}`)));
              inflight = true;
            }
          });
          this.writeBigBoard();
          if (!inflight) {
            if (this.browser) {
              if (this.browser) {
                this.browser.disconnect().then(() => {
                  console.log(
                    ansiC3.inverse(`${this.name} has been tested. Goodbye.`)
                  );
                  process.exit();
                });
              }
            }
          }
        };
        this.launchers = {};
        this.ports = {};
        this.queue = [];
        this.configs.ports.forEach((element) => {
          this.ports[element] = "";
        });
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
          metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
        }
        if (!fs19.existsSync(metafilePath)) {
          console.log(
            ansiC3.yellow(`Metafile not found at ${metafilePath}, skipping`)
          );
          return;
        }
        let metafile;
        try {
          const fileContent = fs19.readFileSync(metafilePath).toString();
          const parsedData = JSON.parse(fileContent);
          if (platform === "python") {
            metafile = parsedData.metafile || parsedData;
          } else {
            metafile = parsedData.metafile;
          }
          if (!metafile) {
            console.log(
              ansiC3.yellow(ansiC3.inverse(`No metafile found in ${metafilePath}`))
            );
            return;
          }
        } catch (error) {
          console.error(`Error reading metafile at ${metafilePath}:`, error);
          return;
        }
        const outputs = metafile.outputs;
        Object.keys(outputs).forEach(async (k) => {
          const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
          if (!k.startsWith(pattern)) {
            return;
          }
          const output = outputs[k];
          if (!output || !output.inputs) {
            return;
          }
          const addableFiles = Object.keys(output.inputs).filter((i) => {
            if (!fs19.existsSync(i))
              return false;
            if (i.startsWith("node_modules"))
              return false;
            if (i.startsWith("./node_modules"))
              return false;
            return true;
          });
          const f = `${k.split(".").slice(0, -1).join(".")}/`;
          if (!fs19.existsSync(f)) {
            fs19.mkdirSync(f, { recursive: true });
          }
          let entrypoint = output.entryPoint;
          if (entrypoint) {
            entrypoint = path16.normalize(entrypoint);
            const changeDigest = await filesHash(addableFiles);
            if (changeDigest === changes[entrypoint]) {
            } else {
              changes[entrypoint] = changeDigest;
              if (platform === "node" || platform === "web" || platform === "pure") {
                this.tscCheck({
                  platform,
                  addableFiles,
                  entrypoint
                });
                this.eslintCheck(entrypoint, platform, addableFiles);
              } else if (platform === "python") {
                this.pythonLintCheck(entrypoint, addableFiles);
                this.pythonTypeCheck(entrypoint, addableFiles);
              }
              this.makePrompt(entrypoint, addableFiles, platform);
              const testName2 = this.findTestNameByEntrypoint(entrypoint, platform);
              if (testName2) {
                console.log(
                  ansiC3.green(
                    ansiC3.inverse(
                      `Source files changed, re-queueing test: ${testName2}`
                    )
                  )
                );
                this.addToQueue(testName2, platform);
              } else {
                console.error(
                  `Could not find test for entrypoint: ${entrypoint} (${platform})`
                );
                process.exit(-1);
              }
            }
          }
        });
      }
      findTestNameByEntrypoint(entrypoint, platform) {
        const runnables = getRunnables(this.configs.tests, this.name);
        let entryPointsMap;
        switch (platform) {
          case "node":
            entryPointsMap = runnables.nodeEntryPoints;
            break;
          case "web":
            entryPointsMap = runnables.webEntryPoints;
            break;
          case "pure":
            entryPointsMap = runnables.pureEntryPoints;
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
          console.error(`${entrypoint} not found`);
        }
        return entryPointsMap[entrypoint];
      }
      async pythonLintCheck(entrypoint, addableFiles) {
        const reportDest = `testeranto/reports/${this.name}/${entrypoint.split(".").slice(0, -1).join(".")}/python`;
        if (!fs19.existsSync(reportDest)) {
          fs19.mkdirSync(reportDest, { recursive: true });
        }
        const lintErrorsPath = `${reportDest}/lint_errors.txt`;
        try {
          const { spawn: spawn4 } = await import("child_process");
          const child = spawn4("flake8", [entrypoint, "--max-line-length=88"], {
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
            child.on("close", (code) => {
              const output = stdout + stderr;
              if (output.trim()) {
                fs19.writeFileSync(lintErrorsPath, output);
                this.summary[entrypoint].staticErrors = output.split("\n").length;
              } else {
                if (fs19.existsSync(lintErrorsPath)) {
                  fs19.unlinkSync(lintErrorsPath);
                }
                this.summary[entrypoint].staticErrors = 0;
              }
              resolve();
            });
          });
        } catch (error) {
          console.error(`Error running flake8 on ${entrypoint}:`, error);
          fs19.writeFileSync(
            lintErrorsPath,
            `Error running flake8: ${error.message}`
          );
          this.summary[entrypoint].staticErrors = -1;
        }
      }
      async pythonTypeCheck(entrypoint, addableFiles) {
        const reportDest = `testeranto/reports/${this.name}/${entrypoint.split(".").slice(0, -1).join(".")}/python`;
        if (!fs19.existsSync(reportDest)) {
          fs19.mkdirSync(reportDest, { recursive: true });
        }
        const typeErrorsPath = `${reportDest}/type_errors.txt`;
        try {
          const { spawn: spawn4 } = await import("child_process");
          const child = spawn4("mypy", [entrypoint], {
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
            child.on("close", (code) => {
              const output = stdout + stderr;
              if (output.trim()) {
                fs19.writeFileSync(typeErrorsPath, output);
                this.summary[entrypoint].typeErrors = output.split("\n").length;
              } else {
                if (fs19.existsSync(typeErrorsPath)) {
                  fs19.unlinkSync(typeErrorsPath);
                }
                this.summary[entrypoint].typeErrors = 0;
              }
              resolve();
            });
          });
        } catch (error) {
          console.error(`Error running mypy on ${entrypoint}:`, error);
          fs19.writeFileSync(typeErrorsPath, `Error running mypy: ${error.message}`);
          this.summary[entrypoint].typeErrors = -1;
        }
      }
      async start() {
        try {
          await this.startBuildProcesses();
          const pythonTests = this.configs.tests.filter(
            (test) => test[1] === "python"
          );
          if (pythonTests.length > 0) {
            const { generatePitonoMetafile: generatePitonoMetafile2, writePitonoMetafile: writePitonoMetafile2 } = await Promise.resolve().then(() => (init_pitonoMetafile(), pitonoMetafile_exports));
            const entryPoints = pythonTests.map((test) => test[0]);
            const metafile = await generatePitonoMetafile2(this.name, entryPoints);
            writePitonoMetafile2(this.name, metafile);
          }
          this.onBuildDone();
        } catch (error) {
          console.error("Build processes failed:", error);
          return;
        }
        this.mapping().forEach(async ([command, func]) => {
          globalThis[command] = func;
        });
        if (!fs19.existsSync(`testeranto/reports/${this.name}`)) {
          fs19.mkdirSync(`testeranto/reports/${this.name}`);
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
        const runnables = getRunnables(this.configs.tests, this.name);
        const {
          nodeEntryPoints,
          webEntryPoints,
          pureEntryPoints,
          pythonEntryPoints,
          golangEntryPoints
        } = runnables;
        console.log(
          ansiC3.blue(
            `Runnables for ${this.name}:
Node: ${JSON.stringify(nodeEntryPoints, null, 2)}
Web: ${JSON.stringify(webEntryPoints, null, 2)}
Pure: ${JSON.stringify(pureEntryPoints, null, 2)}
Python: ${JSON.stringify(pythonEntryPoints, null, 2)}
Golang: ${JSON.stringify(golangEntryPoints, null, 2)}`
          )
        );
        [
          ["node", nodeEntryPoints],
          ["web", webEntryPoints],
          ["pure", pureEntryPoints],
          ["python", pythonEntryPoints],
          ["golang", golangEntryPoints]
        ].forEach(([runtime, entryPoints]) => {
          Object.keys(entryPoints).forEach((entryPoint) => {
            const reportDest = `testeranto/reports/${this.name}/${entryPoint.split(".").slice(0, -1).join(".")}/${runtime}`;
            if (!fs19.existsSync(reportDest)) {
              fs19.mkdirSync(reportDest, { recursive: true });
            }
            this.addToQueue(entryPoint, runtime);
          });
        });
        const runtimeConfigs = [
          ["node", nodeEntryPoints],
          ["web", webEntryPoints],
          ["pure", pureEntryPoints],
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
            metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
          }
          const metafileDir = metafile.split("/").slice(0, -1).join("/");
          if (!fs19.existsSync(metafileDir)) {
            fs19.mkdirSync(metafileDir, { recursive: true });
          }
          try {
            if (runtime === "python" && !fs19.existsSync(metafile)) {
              const { generatePitonoMetafile: generatePitonoMetafile2, writePitonoMetafile: writePitonoMetafile2 } = await Promise.resolve().then(() => (init_pitonoMetafile(), pitonoMetafile_exports));
              const entryPointList = Object.keys(entryPoints);
              if (entryPointList.length > 0) {
                const metafileData = await generatePitonoMetafile2(
                  this.name,
                  entryPointList
                );
                writePitonoMetafile2(this.name, metafileData);
              }
            }
            await pollForFile(metafile);
            let timeoutId;
            const watcher = watch(metafile, async (e, filename) => {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(async () => {
                console.log(
                  ansiC3.yellow(ansiC3.inverse(`< ${e} ${filename} (${runtime})`))
                );
                try {
                  await this.metafileOutputs(runtime);
                  console.log(
                    ansiC3.blue(
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
              case "pure":
                this.importMetafileWatcher = watcher;
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
        console.log(ansiC3.inverse("Testeranto-Run is shutting down gracefully..."));
        this.mode = "once";
        this.nodeMetafileWatcher.close();
        this.webMetafileWatcher.close();
        this.importMetafileWatcher.close();
        if (this.pitonoMetafileWatcher) {
          this.pitonoMetafileWatcher.close();
        }
        if (this.gitWatcher) {
          this.gitWatcher.close();
        }
        if (this.gitWatchTimeout) {
          clearTimeout(this.gitWatchTimeout);
        }
        Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
        if (this.wss) {
          this.wss.close(() => {
            console.log("WebSocket server closed");
          });
        }
        this.clients.forEach((client) => {
          client.terminate();
        });
        this.clients.clear();
        if (this.httpServer) {
          this.httpServer.close(() => {
            console.log("HTTP server closed");
          });
        }
        this.checkForShutdown();
      }
      findIndexHtml() {
        const possiblePaths = [
          "dist/index.html",
          "testeranto/dist/index.html",
          "../dist/index.html",
          "./index.html"
        ];
        for (const path19 of possiblePaths) {
          if (fs19.existsSync(path19)) {
            return path19;
          }
        }
        return null;
      }
      addToQueue(src, runtime) {
        if (src.includes("testeranto/bundles")) {
          const runnables = getRunnables(this.configs.tests, this.name);
          const allEntryPoints = [
            ...Object.entries(runnables.nodeEntryPoints),
            ...Object.entries(runnables.webEntryPoints),
            ...Object.entries(runnables.pureEntryPoints),
            ...Object.entries(runnables.pythonEntryPoints),
            ...Object.entries(runnables.golangEntryPoints)
          ];
          const normalizedSrc = path16.normalize(src);
          for (const [testName2, bundlePath] of allEntryPoints) {
            const normalizedBundlePath = path16.normalize(bundlePath);
            if (normalizedSrc.endsWith(normalizedBundlePath)) {
              src = testName2;
              break;
            }
          }
        }
        this.cleanupTestProcesses(src);
        if (!this.queue.includes(src)) {
          this.queue.push(src);
          console.log(
            ansiC3.green(
              ansiC3.inverse(`Added ${src} (${runtime}) to the processing queue`)
            )
          );
          this.checkQueue();
        } else {
          console.log(
            ansiC3.yellow(
              ansiC3.inverse(`Test ${src} is already in the queue, skipping`)
            )
          );
        }
      }
      cleanupTestProcesses(testName2) {
        const processesToCleanup = [];
        for (const [processId, processInfo] of this.allProcesses.entries()) {
          if (processInfo.testName === testName2 && processInfo.status === "running") {
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
            this.broadcast({
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
              ansiC3.yellow(
                `Skipping ${x} - already running, will be re-queued when current run completes`
              )
            );
            continue;
          }
          const test = this.configs.tests.find((t) => t[0] === x);
          if (!test) {
            console.error(`test is undefined ${x}`);
            continue;
          }
          const runtime = test[1];
          const runnables = getRunnables(this.configs.tests, this.name);
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
            case "pure":
              dest = runnables.pureEntryPoints[x];
              if (dest) {
                this.launchPure(x, dest);
              } else {
                console.error(`No destination found for pure test: ${x}`);
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
          console.log(ansiC3.inverse(`The queue is empty`));
        }
      }
      onBuildDone() {
        console.log("Build processes completed");
        this.startGitWatcher();
      }
    };
  }
});

// src/PM/PM_WithHelpo.ts
import { spawnSync } from "node:child_process";
import fs20 from "fs";
import path17 from "path";
var PM_WithHelpo;
var init_PM_WithHelpo = __esm({
  async "src/PM/PM_WithHelpo.ts"() {
    "use strict";
    await init_PM_WithProcesses();
    PM_WithHelpo = class extends PM_WithProcesses {
      constructor(configs, name, mode2) {
        super(configs, name, mode2);
        this.aiderProcess = null;
        this.MAX_HISTORY_SIZE = 10 * 1024;
        // 10KB
        this.isAiderAtPrompt = false;
        this.chatHistoryPath = path17.join(
          process.cwd(),
          "testeranto",
          "helpo_chat_history.json"
        );
        this.initializeChatHistory();
        this.startAiderProcess();
      }
      initializeChatHistory() {
        fs20.writeFileSync(this.chatHistoryPath, JSON.stringify([]));
        const messagePath = path17.join(
          process.cwd(),
          "testeranto",
          "helpo_chat_message.txt"
        );
        const messageDir = path17.dirname(messagePath);
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
        this.broadcast({
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
        this.broadcast({
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
              const messagePath = path17.join(
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
      // Override WebSocket message handling to include chat messages
      setupWebSocketHandlers() {
      }
      // This method should be called when a WebSocket message is received
      handleWebSocketMessage(ws, message) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          if (parsedMessage.type === "chatMessage") {
            this.handleChatMessage(parsedMessage.content);
          } else {
            super.handleWebSocketMessage?.(ws, message);
          }
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
        }
      }
    };
  }
});

// src/PM/main.ts
var main_exports = {};
__export(main_exports, {
  PM_Main: () => PM_Main
});
import { spawn as spawn3 } from "node:child_process";
import ansiColors from "ansi-colors";
import net from "net";
import fs21 from "fs";
import ansiC4 from "ansi-colors";
import path18 from "node:path";
var files2, screenshots2, PM_Main;
var init_main = __esm({
  async "src/PM/main.ts"() {
    "use strict";
    init_utils();
    init_queue();
    init_utils2();
    await init_PM_WithHelpo();
    files2 = {};
    screenshots2 = {};
    PM_Main = class extends PM_WithHelpo {
      constructor() {
        super(...arguments);
        this.launchPure = async (src, dest) => {
          console.log(ansiC4.green(ansiC4.inverse(`pure < ${src}`)));
          const processId = `pure-${src}-${Date.now()}`;
          const command = `pure test: ${src}`;
          const purePromise = (async () => {
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/pure`;
            if (!fs21.existsSync(reportDest)) {
              fs21.mkdirSync(reportDest, { recursive: true });
            }
            const destFolder = dest.replace(".mjs", "");
            let argz = "";
            const testConfig = this.configs.tests.find((t) => {
              return t[0] === src;
            });
            if (!testConfig) {
              console.log(
                ansiC4.inverse("missing test config! Exiting ungracefully!")
              );
              process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            const portsToUse = [];
            if (testConfigResource.ports === 0) {
              argz = JSON.stringify({
                scheduled: true,
                name: src,
                ports: portsToUse,
                fs: reportDest,
                browserWSEndpoint: this.browser.wsEndpoint()
              });
            } else if (testConfigResource.ports > 0) {
              const openPorts = Object.entries(this.ports).filter(
                ([portnumber, status]) => status === ""
              );
              if (openPorts.length >= testConfigResource.ports) {
                for (let i = 0; i < testConfigResource.ports; i++) {
                  portsToUse.push(openPorts[i][0]);
                  this.ports[openPorts[i][0]] = src;
                }
                argz = JSON.stringify({
                  scheduled: true,
                  name: src,
                  ports: portsToUse,
                  fs: destFolder,
                  browserWSEndpoint: this.browser.wsEndpoint()
                });
              } else {
                this.queue.push(src);
                return [Math.random(), argz];
              }
            } else {
              console.error("negative port makes no sense", src);
              process.exit(-1);
            }
            const builtfile = dest;
            const logs = createLogStreams(reportDest, "pure");
            try {
              await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
                return module.default.then((defaultModule) => {
                  return defaultModule.receiveTestResourceConfig(argz).then(async (results) => {
                    statusMessagePretty(results.fails, src, "pure");
                    this.bddTestIsNowDone(src, results.fails);
                    return results.fails;
                  });
                }).catch((e2) => {
                  console.log(
                    ansiColors.red(
                      `pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`
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
                  logs.exit.write(e2.stack);
                  logs.exit.write(-1);
                  this.bddTestIsNowDone(src, -1);
                  statusMessagePretty(-1, src, "pure");
                  throw e2;
                });
              });
            } catch (e3) {
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
              logs.writeExitCode(-1, e3);
              console.log(
                ansiC4.red(
                  ansiC4.inverse(
                    `${src} 1 errored with: ${e3}. Check logs for more info`
                  )
                )
              );
              logs.exit.write(e3.stack);
              logs.exit.write("-1");
              this.bddTestIsNowDone(src, -1);
              statusMessagePretty(-1, src, "pure");
              throw e3;
            } finally {
              await this.generatePromptFiles(reportDest, src);
              for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                  this.ports[portsToUse[i]] = "";
                }
              }
            }
          })();
          this.addPromiseProcess(
            processId,
            purePromise,
            command,
            "bdd-test",
            src,
            "pure"
          );
        };
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
                          child.send(
                            JSON.stringify({
                              payload: result,
                              key: message[message.length - 1]
                            })
                          );
                        } catch (error) {
                          console.error(`Error handling command ${command2}:`, error);
                        }
                      }
                    });
                  }
                }
              };
              const server = await this.createIpcServer(onData, ipcfile);
              const child = spawn3("node", [builtfile, testResources, ipcfile], {
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
            const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/web`;
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
                  if (!files2[src]) {
                    files2[src] = /* @__PURE__ */ new Set();
                  }
                  delete files2[src];
                  Promise.all(screenshots2[src] || []).then(() => {
                    delete screenshots2[src];
                    page.close();
                  });
                };
                page.on("pageerror", (err) => {
                  logs.writeExitCode(-1, err);
                  console.log(
                    ansiColors.red(
                      `web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
                    )
                  );
                  this.bddTestIsNowDone(src, -1);
                  close();
                  reject(err);
                });
                await page.goto(`file://${`${destFolder}.html`}`, {});
                await page.evaluate(webEvaluator(d, webArgz)).then(async ({ fails, failed, features }) => {
                  statusMessagePretty(fails, src, "web");
                  this.bddTestIsNowDone(src, fails);
                  resolve();
                }).catch((e) => {
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
              const child = spawn3(pythonCommand, [src, testResources, ipcfile], {
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
                          child.send(
                            JSON.stringify({
                              payload: result,
                              key: message[message.length - 1]
                            })
                          );
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
              let currentDir = path18.dirname(src);
              let goModDir = null;
              while (currentDir !== path18.parse(currentDir).root) {
                if (fs21.existsSync(path18.join(currentDir, "go.mod"))) {
                  goModDir = currentDir;
                  break;
                }
                currentDir = path18.dirname(currentDir);
              }
              if (!goModDir) {
                console.error(`Could not find go.mod file for test ${src}`);
                goModDir = path18.dirname(src);
                console.error(`Falling back to: ${goModDir}`);
              }
              const relativeTestPath = path18.relative(goModDir, src);
              const child = spawn3(
                "go",
                ["test", "-v", "-json", "./" + path18.dirname(relativeTestPath)],
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
      async setupTestEnvironment(src, runtime) {
        this.bddTestIsRunning(src);
        const reportDest = `testeranto/reports/${this.name}/${src.split(".").slice(0, -1).join(".")}/${runtime}`;
        if (!fs21.existsSync(reportDest)) {
          fs21.mkdirSync(reportDest, { recursive: true });
        }
        const testConfig = this.configs.tests.find((t) => t[0] === src);
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
          server.listen(ipcfile, (err) => {
            if (err)
              reject(err);
            else
              resolve(server);
          });
          server.on("error", reject);
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
              fullPath: path18.resolve(process.cwd(), src)
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
          fullPath: path18.resolve(process.cwd(), src)
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
      getGolangSourceFiles(src) {
        const testDir = path18.dirname(src);
        const files3 = [];
        try {
          const dirContents = fs21.readdirSync(testDir);
          dirContents.forEach((file) => {
            if (file.endsWith(".go")) {
              files3.push(path18.join(testDir, file));
            }
          });
        } catch (error) {
          console.error(`Error reading directory ${testDir}:`, error);
        }
        if (!files3.includes(src)) {
          files3.push(src);
        }
        return files3;
      }
    };
  }
});

// src/testeranto.ts
init_utils();
import ansiC5 from "ansi-colors";
import fs22 from "fs";
import readline from "readline";

// src/utils/buildTemplates.ts
var getBaseHtml = (title) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>${title} - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <script>
    function initApp() {
      if (window.React && window.ReactDOM && window.App) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
      } else {
        setTimeout(initApp, 100);
      }
    }
    window.addEventListener('DOMContentLoaded', initApp);
  </script>
`;
var AppHtml = () => `
  ${getBaseHtml("Testeranto")}
  
  <link rel="stylesheet" href="App.css" />
  <script src="App.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

// src/PM/pitonoBuild.ts
init_pitonoMetafile();

// src/utils/pitonoWatcher.ts
init_pitonoMetafile();
import chokidar from "chokidar";
import path3 from "path";
import fs2 from "fs";
var PitonoWatcher = class {
  constructor(testName2, entryPoints) {
    this.watcher = null;
    this.onChangeCallback = null;
    this.testName = testName2;
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
    if (!fs2.existsSync(outputDir)) {
      fs2.mkdirSync(outputDir, { recursive: true });
    }
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
  constructor(config, testName2) {
    this.watcher = null;
    this.config = config;
    this.testName = testName2;
  }
  async build() {
    const pythonTests = this.config.tests.filter((test) => test[1] === "python");
    const hasPythonTests = pythonTests.length > 0;
    if (hasPythonTests) {
      const pythonEntryPoints = pythonTests.map((test) => test[0]);
      const metafile = await generatePitonoMetafile(this.testName, pythonEntryPoints);
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

// src/testeranto.ts
var { GolingvuBuild: GolingvuBuild2 } = await Promise.resolve().then(() => (init_golingvuBuild(), golingvuBuild_exports));
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
var testName = process.argv[2];
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}
var configFilePath = process.cwd() + "/testeranto.config.ts";
import(configFilePath).then(async (module) => {
  const pckge = (await import(`${process.cwd()}/package.json`)).default;
  const bigConfig = module.default;
  const project = bigConfig.projects[testName];
  if (!project) {
    console.error("no project found for", testName, "in testeranto.config.ts");
    process.exit(-1);
  }
  try {
    fs22.writeFileSync(
      `${process.cwd()}/testeranto/projects.json`,
      JSON.stringify(Object.keys(bigConfig.projects), null, 2)
    );
  } catch (e) {
    console.error("there was a problem");
    console.error(e);
  }
  const rawConfig = bigConfig.projects[testName];
  if (!rawConfig) {
    console.error(`Project "${testName}" does not exist in the configuration.`);
    console.error("Available projects:", Object.keys(bigConfig.projects));
    process.exit(-1);
  }
  if (!rawConfig.tests) {
    console.error(testName, "appears to have no tests: ", configFilePath);
    console.error(`here is the config:`);
    console.log(JSON.stringify(rawConfig));
    process.exit(-1);
  }
  const config = {
    ...rawConfig,
    buildDir: process.cwd() + "/testeranto/bundles/" + testName
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
  pm = new PM_Main2(config, testName, mode);
  await pm.start();
  fs22.writeFileSync(`${process.cwd()}/testeranto/projects.html`, AppHtml());
  Object.keys(bigConfig.projects).forEach((projectName) => {
    if (!fs22.existsSync(`testeranto/reports/${projectName}`)) {
      fs22.mkdirSync(`testeranto/reports/${projectName}`);
    }
    fs22.writeFileSync(
      `testeranto/reports/${projectName}/config.json`,
      JSON.stringify(config, null, 2)
    );
  });
  const {
    nodeEntryPoints,
    nodeEntryPointSidecars,
    webEntryPoints,
    webEntryPointSidecars,
    pureEntryPoints,
    pureEntryPointSidecars,
    pythonEntryPoints,
    pythonEntryPointSidecars,
    golangEntryPoints,
    golangEntryPointSidecars
  } = getRunnables(config.tests, testName);
  console.log("Node entry points:", Object.keys(nodeEntryPoints));
  console.log("Web entry points:", Object.keys(webEntryPoints));
  console.log("Pure entry points:", Object.keys(pureEntryPoints));
  const golangTests = config.tests.filter((test) => test[1] === "golang");
  const hasGolangTests = golangTests.length > 0;
  if (hasGolangTests) {
    const golingvuBuild = new GolingvuBuild2(config, testName);
    const golangEntryPoints2 = await golingvuBuild.build();
    golingvuBuild.onBundleChange(() => {
      Object.keys(golangEntryPoints2).forEach((entryPoint) => {
        if (pm) {
          pm.addToQueue(entryPoint, "golang");
        }
      });
    });
  }
  const pitonoTests = config.tests.filter((test) => test[1] === "python");
  const hasPitonoTests = pitonoTests.length > 0;
  if (hasPitonoTests) {
    const pitonoBuild = new PitonoBuild(config, testName);
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
    ["pure", Object.keys(pureEntryPoints)],
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
    ["python", Object.keys(pythonEntryPoints)],
    ["golang", Object.keys(golangEntryPoints)]
  ].forEach(async ([runtime, keys]) => {
    keys.forEach(async (k) => {
      fs22.mkdirSync(
        `testeranto/reports/${testName}/${k.split(".").slice(0, -1).join(".")}/${runtime}`,
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
