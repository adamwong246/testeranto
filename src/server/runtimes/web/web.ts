/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import esbuild from "esbuild";

import { IBuiltConfig } from "../../../Types";
import path from "path";
import fs from "fs";
import configer from "./esbuild";

const testName = process.argv[2];
const mode = process.argv[3] || "dev";

async function startChromeBrowser() {
  // console.log("Starting Chrome browser via Puppeteer...");
  // try {
  //   browser = await puppeteer.launch({
  //     slowMo: 1,
  //     waitForInitialPage: false,
  //     // executablePath,
  //     defaultViewport: null, // Disable default 800x600 viewport
  //     dumpio: false,
  //     executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium-browser",
  //     args: [
  //       "--no-sandbox",
  //       "--disable-setuid-sandbox",
  //       "--disable-dev-shm-usage",
  //       "--disable-accelerated-2d-canvas",
  //       "--disable-gpu",
  //       "--window-size=1920,1080",
  //       "--single-process", // May help in Docker
  //       "--no-zygote", // May help in Docker
  //     ],
  //     headless: "new", // Use new headless mode
  //   });
  //   console.log("Chrome browser started");
  //   return browser;
  // } catch (error) {
  //   console.error("Failed to launch Chrome:", error);
  //   console.error("Chromium is not available in the container.");
  //   console.error("Make sure chromium is installed in the Docker image.");
  //   throw new Error(`Chrome is not available: ${error.message}`);
  // }
}

async function runTestInBrowser(
  testPath: string,
  config: IBuiltConfig,
  testFile: string
): Promise<boolean> {
  console.log(`Running web test: ${testPath}`);

  // const page = await browser.newPage();

  // Set up console logging
  // page.on("console", (msg) => {
  //   console.log(`[WEB TEST CONSOLE] ${msg.type()}: ${msg.text()}`);
  // });

  // page.on("pageerror", (error) => {
  //   console.error(`[WEB TEST PAGE ERROR] ${error}`);
  // });

  // Create report directory
  const reportDest = `./testeranto/reports/${testName}/${testFile.replace(
    ".test.mjs",
    ""
  )}/web`;
  if (!fs.existsSync(reportDest)) {
    fs.mkdirSync(reportDest, { recursive: true });
  }

  // Prepare test resources
  const webArgz = JSON.stringify({
    name: testFile,
    ports: [],
    fs: reportDest,
    // browserWSEndpoint: browser.wsEndpoint(),
  });

  // Load a blank page
  // await page.goto(`file://${path.dirname(testPath)}/`, {});

  // Create evaluation string to import and run the test module
  // Add cache busting to prevent caching issues
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
    // await page.evaluate(evaluation);
    // Wait a bit for tests to run
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Check if tests.json was created
    const testsJsonPath = path.join(reportDest, "tests.json");
    if (fs.existsSync(testsJsonPath)) {
      console.log(`Tests completed for ${testFile}`);
      // await page.close();
      return true;
    } else {
      console.error(`No tests.json created for ${testFile}`);
      // await page.close();
      return false;
    }
  } catch (error) {
    console.error(`Web test failed: ${testFile}`, error);
    // Create a minimal tests.json on failure
    const testsJsonPath = path.join(reportDest, "tests.json");
    if (!fs.existsSync(testsJsonPath)) {
      fs.writeFileSync(
        testsJsonPath,
        JSON.stringify(
          {
            tests: [],
            features: [],
            givens: [],
            fullPath: testFile,
          },
          null,
          2
        )
      );
    }
    // await page.close();
    return false;
  }
}

// run esbuild in watch mode using esbuildConfigs. Write to fs the bundle and metafile
async function startBundling(
  config: IBuiltConfig
  // onMetafileChange: (esbuild: esbuild.BuildResult) => void
) {
  // console.log(`WEB BUILDER is now bundling: ${testName}`);

  // const bundlesDir = path.join(
  //   process.cwd(),
  //   "testeranto/bundles/allTests/web"
  // );

  // // Ensure bundles directory exists
  // if (!fs.existsSync(bundlesDir)) {
  //   console.log(`Creating bundles directory: ${bundlesDir}`);
  //   fs.mkdirSync(bundlesDir, { recursive: true });
  // }

  // Get web build configuration
  const webConfig = configer(config, testName);

  // Build the web bundle
  const buildResult = await esbuild.build(webConfig);

  if (buildResult.errors.length > 0) {
    console.error("WEB BUILDER build errors:", buildResult.errors);
  }
  if (buildResult.warnings.length > 0) {
    console.warn("WEB BUILDER build warnings:", buildResult.warnings);
  }

  console.log(`WEB BUILDER build completed for ${testName}`);

  // Write metafile in the same format as other runtimes
  const metafilesDir =
    process.env.METAFILES_DIR || "/workspace/testeranto/metafiles/web";

  // Ensure directory exists
  if (!fs.existsSync(metafilesDir)) {
    fs.mkdirSync(metafilesDir, { recursive: true });
  }

  const generatedMetafilePath = path.join(metafilesDir, "allTests.json");
  if (buildResult.metafile) {
    const metafileWrapper = {
      errors: [],
      warnings: [],
      metafile: buildResult.metafile,
    };
    fs.writeFileSync(
      generatedMetafilePath,
      JSON.stringify(metafileWrapper, null, 2)
    );
    console.log(`Web metafile written to ${generatedMetafilePath}`);
  } else {
    console.warn("No metafile generated by esbuild");
  }

  // Start Chrome browser
  // await startChromeBrowser();

  // Read the metafile to find built test files
  const readMetafilePath = path.join(
    process.cwd(),
    "testeranto/metafiles/web/allTests.json"
  );
  let builtTestFiles: string[] = [];

  // Define bundlesDir for fallback scanning
  const bundlesDir = path.join(
    process.cwd(),
    "testeranto/bundles/allTests/web"
  );

  if (fs.existsSync(readMetafilePath)) {
    console.log(`Reading metafile from: ${readMetafilePath}`);
    const metafileContent = fs.readFileSync(readMetafilePath, "utf-8");
    const metafile = JSON.parse(metafileContent);

    // Extract output files from the metafile
    if (metafile.metafile && metafile.metafile.outputs) {
      for (const [outputPath, outputInfo] of Object.entries(
        metafile.metafile.outputs
      )) {
        const outputInfoTyped = outputInfo as any;
        // Look for entry points (test files)
        if (outputInfoTyped.entryPoint && outputPath.endsWith(".mjs")) {
          console.log(`Found built test file: ${outputPath}`);
          builtTestFiles.push(outputPath);
        }
      }
    }
  } else {
    console.warn(
      `Metafile not found at ${readMetafilePath}, falling back to scanning bundles directory`
    );
    // Fallback: scan the bundles directory
    const files = fs.readdirSync(bundlesDir);
    builtTestFiles = files.filter((f) => f.endsWith(".test.mjs"));
  }

  // console.log(`Found ${builtTestFiles.length} test files to run`);

  // let allTestsPassed = true;
  // for (const testFile of builtTestFiles) {
  //   console.log(`\n=== Running web test: ${testFile} ===`);
  //   // Get the absolute path
  //   const absoluteTestPath = path.join(process.cwd(), testFile);
  //   const testPassed = await runTestInBrowser(
  //     absoluteTestPath,
  //     config,
  //     path.basename(testFile)
  //   );
  //   if (!testPassed) {
  //     allTestsPassed = false;
  //   }
  //   console.log(`=== Finished web test: ${testFile} ===\n`);
  // }

  // onMetafileChange(buildResult);

  // // Report overall status
  // if (allTestsPassed) {
  //   console.log("✅ All web tests passed!");
  // } else {
  //   console.error("❌ Some web tests failed!");
  //   // In dev mode, we don't want to exit with error to keep watching
  //   if (mode !== "dev") {
  //     process.exit(1);
  //   }
  // }

  // In dev mode, watch for changes
  if (mode === "dev") {
    console.log("WEB BUILDER: Watching for changes...");
    const ctx = await esbuild.context(webConfig);
    await ctx.watch();
  }
}

// // run using user defined static analysis when the metafile changes
// async function startStaticAnalysis(esbuildResult: esbuild.BuildResult) {
//   console.log(`WEB BUILDER is now performing static analysis upon: `);
//   // Implement web-specific static analysis if needed
// }

// // run testeranto tests when the metafile changes
// async function startBddTests(esbuildResult: esbuild.BuildResult) {
//   console.log(`WEB BUILDER is now running testeranto tests in browser`);
//   // Tests are already running via runTestInBrowser
// }

async function main() {
  const configPathBase = `/workspace/${testName}`;

  const config = (await import(`/workspace/${testName}`)).default;

  try {
    await startBundling(config);

    // Keep the process alive in dev mode
    if (mode === "dev") {
      console.log("WEB BUILDER: Running in dev mode, keeping process alive...");
      // Keep process alive
      process.on("SIGINT", async () => {
        console.log("WEB BUILDER: Shutting down...");
        // if (browser) await browser.close();
        process.exit(0);
      });
    }
  } catch (error) {
    console.error("WEB BUILDER: Error:", error);
    // if (browser) await browser.close();
    process.exit(1);
  }
}

main();
