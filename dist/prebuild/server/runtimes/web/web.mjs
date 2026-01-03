import {
  esbuildConfigs_default,
  featuresPlugin_default,
  inputFilesPlugin_default,
  rebuildPlugin_default
} from "../../../chunk-SFBHYNUJ.mjs";

// src/server/runtimes/web/web.ts
import esbuild from "esbuild";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

// src/server/runtimes/web/esbuild.ts
var absoluteBundlesDir = (c) => {
  return "./testeranto/bundles/allTests/web/";
};
var esbuild_default = (config, testName2) => {
  const entrypoints = ["./example/Calculator.test.ts"];
  const { inputFilesPluginFactory, register } = inputFilesPlugin_default(
    "web",
    testName2
  );
  return {
    ...esbuildConfigs_default(config),
    outdir: absoluteBundlesDir(config),
    outbase: ".",
    metafile: true,
    supported: {
      "dynamic-import": true
    },
    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"web"`
    },
    absWorkingDir: process.cwd(),
    platform: "browser",
    packages: "external",
    entryPoints: entrypoints,
    bundle: true,
    format: "esm",
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("web"),
      ...config.web?.plugins?.map((p) => p(register, entrypoints)) || []
    ]
  };
};

// src/server/runtimes/web/web.ts
console.log("!!!", process.argv);
var testName = process.argv[2];
var mode = process.argv[3] || "dev";
var browser;
async function startChromeBrowser() {
  console.log("Starting Chrome browser via Puppeteer...");
  try {
    browser = await puppeteer.launch({
      slowMo: 1,
      waitForInitialPage: false,
      // executablePath,
      defaultViewport: null,
      // Disable default 800x600 viewport
      dumpio: false,
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium-browser",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920,1080",
        "--single-process",
        // May help in Docker
        "--no-zygote"
        // May help in Docker
      ],
      headless: "new"
      // Use new headless mode
    });
    console.log("Chrome browser started");
    return browser;
  } catch (error) {
    console.error("Failed to launch Chrome:", error);
    console.error("Chromium is not available in the container.");
    console.error("Make sure chromium is installed in the Docker image.");
    throw new Error(`Chrome is not available: ${error.message}`);
  }
}
async function runTestInBrowser(testPath, config, testFile) {
  console.log(`Running web test: ${testPath}`);
  const page = await browser.newPage();
  page.on("console", (msg) => {
    console.log(`[WEB TEST CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (error) => {
    console.error(`[WEB TEST PAGE ERROR] ${error}`);
  });
  const reportDest = `./testeranto/reports/${testName}/${testFile.replace(
    ".test.mjs",
    ""
  )}/web`;
  if (!fs.existsSync(reportDest)) {
    fs.mkdirSync(reportDest, { recursive: true });
  }
  const webArgz = JSON.stringify({
    name: testFile,
    ports: [],
    fs: reportDest,
    browserWSEndpoint: browser.wsEndpoint()
  });
  await page.goto(`file://${path.dirname(testPath)}/`, {});
  const d = `${testPath}?cacheBust=${Date.now()}`;
  const evaluation = `
    (async () => {
      try {
        const module = await import('file://${d}');
        // The module should handle test execution
        // We need to wait for it to complete
        console.log('Web test module loaded');
        return { fails: 0, failed: [], features: [] };
      } catch (error) {
        console.error('Failed to run web test:', error);
        throw error;
      }
    })()
  `;
  try {
    await page.evaluate(evaluation);
    await new Promise((resolve) => setTimeout(resolve, 5e3));
    const testsJsonPath = path.join(reportDest, "tests.json");
    if (fs.existsSync(testsJsonPath)) {
      console.log(`Tests completed for ${testFile}`);
      await page.close();
      return true;
    } else {
      console.error(`No tests.json created for ${testFile}`);
      await page.close();
      return false;
    }
  } catch (error) {
    console.error(`Web test failed: ${testFile}`, error);
    const testsJsonPath = path.join(reportDest, "tests.json");
    if (!fs.existsSync(testsJsonPath)) {
      fs.writeFileSync(
        testsJsonPath,
        JSON.stringify(
          {
            tests: [],
            features: [],
            givens: [],
            fullPath: testFile
          },
          null,
          2
        )
      );
    }
    await page.close();
    return false;
  }
}
async function startBundling(config, onMetafileChange) {
  const webConfig = esbuild_default(config, testName);
  const buildResult = await esbuild.build(webConfig);
  if (buildResult.errors.length > 0) {
    console.error("WEB BUILDER build errors:", buildResult.errors);
  }
  if (buildResult.warnings.length > 0) {
    console.warn("WEB BUILDER build warnings:", buildResult.warnings);
  }
  console.log(`WEB BUILDER build completed for ${testName}`);
  await startChromeBrowser();
  const metafilePath = path.join(
    process.cwd(),
    "testeranto/metafiles/web/allTests.json"
  );
  let builtTestFiles = [];
  if (fs.existsSync(metafilePath)) {
    console.log(`Reading metafile from: ${metafilePath}`);
    const metafileContent = fs.readFileSync(metafilePath, "utf-8");
    const metafile = JSON.parse(metafileContent);
    if (metafile.metafile && metafile.metafile.outputs) {
      for (const [outputPath, outputInfo] of Object.entries(
        metafile.metafile.outputs
      )) {
        const outputInfoTyped = outputInfo;
        if (outputInfoTyped.entryPoint && outputPath.endsWith(".mjs")) {
          console.log(`Found built test file: ${outputPath}`);
          builtTestFiles.push(outputPath);
        }
      }
    }
  } else {
    console.warn(
      `Metafile not found at ${metafilePath}, falling back to scanning bundles directory`
    );
    const files = fs.readdirSync(bundlesDir);
    builtTestFiles = files.filter((f) => f.endsWith(".test.mjs"));
  }
  console.log(`Found ${builtTestFiles.length} test files to run`);
  let allTestsPassed = true;
  for (const testFile of builtTestFiles) {
    console.log(`
=== Running web test: ${testFile} ===`);
    const absoluteTestPath = path.join(process.cwd(), testFile);
    const testPassed = await runTestInBrowser(
      absoluteTestPath,
      config,
      path.basename(testFile)
    );
    if (!testPassed) {
      allTestsPassed = false;
    }
    console.log(`=== Finished web test: ${testFile} ===
`);
  }
  onMetafileChange(buildResult);
  if (allTestsPassed) {
    console.log("\u2705 All web tests passed!");
  } else {
    console.error("\u274C Some web tests failed!");
    if (mode !== "dev") {
      process.exit(1);
    }
  }
  if (mode === "dev") {
    console.log("WEB BUILDER: Watching for changes...");
    const ctx = await esbuild.context(webConfig);
    await ctx.watch();
  }
}
async function main() {
  const configPathBase = `/workspace/${testName}`;
  const config = (await import(`/workspace/${testName}`)).default;
  try {
    await startBundling(config, (esbuildResult) => {
    });
    if (mode === "dev") {
      console.log("WEB BUILDER: Running in dev mode, keeping process alive...");
      process.on("SIGINT", async () => {
        console.log("WEB BUILDER: Shutting down...");
        if (browser)
          await browser.close();
        process.exit(0);
      });
    }
  } catch (error) {
    console.error("WEB BUILDER: Error:", error);
    if (browser)
      await browser.close();
    process.exit(1);
  }
}
main();
