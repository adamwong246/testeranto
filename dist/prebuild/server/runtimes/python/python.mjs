// src/server/runtimes/python/python.ts
import fs3 from "fs";
import path3 from "path";

// src/clients/utils/pitonoMetafile.ts
import fs from "fs";
import path from "path";
function resolvePythonImport(importPath, currentFile) {
  if (importPath.startsWith(".")) {
    const currentDir = path.dirname(currentFile);
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
      baseDir = path.dirname(baseDir);
    }
    if (remainingPath.length === 0) {
      const initPath = path.join(baseDir, "__init__.py");
      if (fs.existsSync(initPath)) {
        return initPath;
      }
      return null;
    }
    const resolvedPath = path.join(baseDir, remainingPath);
    const extensions = [".py", "/__init__.py"];
    for (const ext of extensions) {
      const potentialPath = resolvedPath + ext;
      if (fs.existsSync(potentialPath)) {
        return potentialPath;
      }
    }
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
      const initPath = path.join(resolvedPath, "__init__.py");
      if (fs.existsSync(initPath)) {
        return initPath;
      }
    }
    return null;
  }
  const dirs = [
    path.dirname(currentFile),
    process.cwd(),
    ...process.env.PYTHONPATH ? process.env.PYTHONPATH.split(path.delimiter) : []
  ];
  for (const dir of dirs) {
    const potentialPaths = [
      path.join(dir, importPath + ".py"),
      path.join(dir, importPath, "__init__.py"),
      path.join(dir, importPath.replace(/\./g, "/") + ".py"),
      path.join(dir, importPath.replace(/\./g, "/"), "__init__.py")
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
    const entryPointName = path.basename(entryPoint, ".py");
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
  const metafilePath = path.join(
    "testeranto",
    "metafiles",
    "python",
    `${path.basename(testName)}.json`
  );
  const metafileDir = path.dirname(metafilePath);
  if (!fs.existsSync(metafileDir)) {
    fs.mkdirSync(metafileDir, { recursive: true });
  }
  fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
  const outputDir = path.join(
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
    const fileName = path.basename(outputPath);
    const fullOutputPath = path.join(outputDir, fileName);
    const outputDirPath = path.dirname(fullOutputPath);
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

// src/clients/utils/pitonoWatcher.ts
import chokidar from "chokidar";
import path2 from "path";
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
    const outputDir = path2.join(
      process.cwd(),
      `testeranto/bundles/python/${this.testName}`
    );
    const lastSignatures = /* @__PURE__ */ new Map();
    const bundleWatcher = chokidar.watch(path2.join(outputDir, "*.py"), {
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

// src/pitono/pitonoBuild.ts
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

// src/server/runtimes/python/python.ts
async function runPythonBuild() {
  try {
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }
    const absoluteConfigPath = path3.resolve(process.cwd(), configPath);
    const configModule = await import(absoluteConfigPath);
    const config = configModule.default;
    const pitonoBuild = new PitonoBuild(config, configPath);
    const entryPoints = await pitonoBuild.build();
    const metafileDir = process.env.METAFILES_DIR || "/workspace/testeranto/metafiles/python";
    const bundlesDir = process.env.BUNDLES_DIR || "/workspace/testeranto/bundles/allTests/python";
    console.log("PYTHON BUILDER: Using metafiles directory:", metafileDir);
    console.log("PYTHON BUILDER: Using bundles directory:", bundlesDir);
    const metafilePath = path3.join(
      metafileDir,
      `${path3.basename(configPath, path3.extname(configPath))}.json`
    );
    if (!fs3.existsSync(metafileDir)) {
      fs3.mkdirSync(metafileDir, { recursive: true });
    }
    const metafile = {
      entryPoints,
      buildTime: (/* @__PURE__ */ new Date()).toISOString(),
      runtime: "python"
    };
    fs3.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log("PYTHON BUILDER: Metafile written to:", metafilePath);
    if (!fs3.existsSync(bundlesDir)) {
      fs3.mkdirSync(bundlesDir, { recursive: true });
      console.log("PYTHON BUILDER: Created bundles directory:", bundlesDir);
    }
  } catch (error) {
    console.error("Python build failed:", error);
    process.exit(1);
  }
}
runPythonBuild();
