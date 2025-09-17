/* eslint-disable @typescript-eslint/no-unused-vars */
import { summaryDotJson } from "./utils/api";

export const fetchDataUtil = async (
  testResponse,
  metafileRes,
  testPath,
  setLogs,
  projectName,
  setSummary,
  setErrorCounts,
  setTestsExist,
  runtime
) => {
  // console.log('Fetching test data for:', { projectName, testPath, runtime });
  const receivedLogs = await testResponse.logs;
  // console.log('Received logs:', Object.keys(receivedLogs));
  let sourceFiles = {};
  let buildLogs = {};

  if (metafileRes.ok) {
    const metafile = await metafileRes.json();
    if (metafile?.metafile?.outputs) {
      // Find input files only for this test's entry point
      const tsSources = new Set<string>();
      const testEntryPoint = `src/${testPath}`;

      // First find all outputs that match this test
      const matchingOutputs = Object.entries(metafile.metafile.outputs).filter(
        ([outputPath, output]) => {
          const normalizedTestPath = testPath.replace(/\./g, "_");
          const testFileName = testPath.split("/").pop();
          const testBaseName = testFileName?.split(".").slice(0, -1).join(".");

          // Also check outputPath normalized for slashes replaced by underscores
          const normalizedOutputPath = outputPath.replace(/\//g, "_");

          return (
            output.entryPoint === testEntryPoint ||
            outputPath.includes(normalizedTestPath) ||
            normalizedOutputPath.includes(normalizedTestPath) ||
            (testBaseName && outputPath.includes(testBaseName))
          );
        }
      );

      // Then collect all inputs from matching outputs
      matchingOutputs.forEach(([_, output]) => {
        Object.keys(output.inputs).forEach((inputPath) => {
          // Check if this input is a source file (TypeScript or Go) and not in node_modules
          if (
            (inputPath.endsWith(".ts") ||
              inputPath.endsWith(".tsx") ||
              inputPath.endsWith(".go") ||
              inputPath.endsWith(".py")) &&
            !inputPath.includes("node_modules")
          ) {
            // Get the full input details from metafile.inputs
            const inputDetails = metafile.metafile.inputs[inputPath];
            if (inputDetails) {
              tsSources.add(inputPath);
              // Also include any imported source files (for TypeScript)
              // Go files don't have imports in the same way, so we'll only process for TypeScript
              if (inputPath.endsWith(".ts") || inputPath.endsWith(".tsx")) {
                inputDetails.imports.forEach((imp) => {
                  if (
                    (imp.path.endsWith(".ts") || imp.path.endsWith(".tsx")) &&
                    !imp.path.includes("node_modules") &&
                    !imp.external
                  ) {
                    tsSources.add(imp.path);
                  }
                });
              }
            }
          }
        });
      });

      // Organize source files into directory tree structure
      const fileTree = {};
      const filesList = await Promise.all(
        Array.from(tsSources).map(async (filePath) => {
          try {
            const fetchPath = filePath.startsWith("/")
              ? filePath
              : `/${filePath.replace(/^\.\//, "")}`;
            const res = await fetch(fetchPath);
            if (res.ok) {
              return {
                path: filePath,
                content: await res.text(),
              };
            }
            return null;
          } catch (err) {
            console.warn(`Failed to fetch source file ${filePath}:`, err);
            return null;
          }
        })
      );

      filesList.forEach((file) => {
        if (!file) return;

        const parts = file.path.split("/");
        let currentLevel = fileTree;

        parts.forEach((part, index) => {
          if (!currentLevel[part]) {
            if (index === parts.length - 1) {
              currentLevel[part] = {
                __isFile: true,
                content: file.content,
              };
            } else {
              currentLevel[part] = {};
            }
          }
          currentLevel = currentLevel[part];
        });
      });

      sourceFiles = fileTree;
      buildLogs = metafile;
    }
  }

  // Add source files and build logs to logs
  receivedLogs["source_files"] = sourceFiles;
  receivedLogs["build_logs"] = buildLogs;
  console.log("Source files structure:", sourceFiles);
  console.log("Build logs:", buildLogs);

  // Ensure tests.json is properly formatted
  if (receivedLogs["tests.json"]) {
    console.log("tests.json content type:", typeof receivedLogs["tests.json"]);
    try {
      // Handle both string and already-parsed JSON
      if (typeof receivedLogs["tests.json"] === "string") {
        receivedLogs["tests.json"] = JSON.parse(receivedLogs["tests.json"]);
      }
      // If it's already an object, leave it as is
    } catch (e) {
      console.error("Failed to parse tests.json:", e);
      // Keep the original content but don't replace it with an error object
    }
  }
  setLogs(receivedLogs);
  // setTypeErrors(testResponse.typeErrors);
  // setLintErrors(testResponse.lintErrors);

  try {
    const summaryResponse = await fetch(summaryDotJson(projectName));
    if (!summaryResponse.ok) throw new Error("Failed to fetch summary");
    const allSummaries = await summaryResponse.json();
    const testSummary = allSummaries[testPath];

    if (testSummary) {
      const counts = {
        typeErrors: Number(testSummary.typeErrors) || 0,
        staticErrors: Number(testSummary.staticErrors) || 0,
        runTimeErrors: Number(testSummary.runTimeErrors) || 0,
      };

      setSummary(testSummary);
      setErrorCounts(counts);
      setTestsExist(testSummary.testsExist !== false);
    }
  } catch (err) {
    console.error("Failed to load summary:", err);
  }

  // Fetch build.json to get build errors and warnings
  try {
    // The build.json is in the runtime directory directly under the test path
    // testPath is "src/lib/pmProxy.test/index.ts"
    // We need to use the directory path without the filename
    const pathParts = testPath.split("/");
    // const fileName = pathParts.pop();
    const directoryPath = pathParts.join("/");

    // Construct the path without the filename without extension
    const buildUrl = `/reports/${projectName}/${directoryPath}/${runtime}/build.json`;
    console.log(`Fetching build.json from: ${buildUrl}`);

    const buildResponse = await fetch(buildUrl);
    if (buildResponse.ok) {
      const buildData = await buildResponse.json();
      console.log("Build data received:", buildData);
      // Add build errors and warnings to logs
      receivedLogs["build.json"] = buildData;
    } else {
      console.log(
        "Build.json not found or not accessible, status:",
        buildResponse.status
      );
      // Add an empty build.json to logs to prevent errors
      receivedLogs["build.json"] = { errors: [], warnings: [] };
    }
  } catch (err) {
    console.log("No build.json found or error fetching it:", err);
    // Add an empty build.json to logs to prevent errors
    receivedLogs["build.json"] = { errors: [], warnings: [] };
  }

  return receivedLogs;
};
