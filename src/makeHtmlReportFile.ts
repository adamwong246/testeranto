import path from "path";
import fs from "fs";
import { IBuiltConfig } from "./Types";

const getSecondaryEndpointsPoints = (config: IBuiltConfig): string[] => {
  const result: string[] = [];
  for (const runtime of ["node", "web", "golang", "python"]) {
    const runtimeConfig = config[runtime as keyof typeof config];
    if (runtimeConfig && runtimeConfig.tests) {
      const testKeys = Object.keys(runtimeConfig.tests);
      result.push(...testKeys);
    }
  }
  return result;
};

export const makeHtmlReportFile = (testsName: string, config: IBuiltConfig) => {
  const tests = [...getSecondaryEndpointsPoints(config)];
  for (const sourceFilePath of tests) {
    const sourceFileSplit = sourceFilePath.split("/");
    const sourceDir = sourceFileSplit.slice(0, -1);
    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
    const sourceFileNameMinusExtension = sourceFileName
      .split(".")
      .slice(0, -1)
      .join(".");

    for (const runtime of ["node", "web", "golang", "python"]) {
      const htmlFilePath = path.normalize(
        `${process.cwd()}/testeranto/reports/${testsName}/${sourceDir.join(
          "/"
        )}/${sourceFileNameMinusExtension}/${runtime}/index.html`
      );

      fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });

      // Calculate relative path to the bundled Report.js
      const htmlDir = path.dirname(htmlFilePath);
      const reportJsPath = path.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.js"
      );
      const relativeReportJsPath = path.relative(htmlDir, reportJsPath);
      // Ensure the path uses forward slashes for URLs
      const relativeReportJsUrl = relativeReportJsPath
        .split(path.sep)
        .join("/");

      const reportCssPath = path.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.css"
      );

      const relativeReportCssPath = path.relative(htmlDir, reportCssPath);
      // Ensure the path uses forward slashes for URLs
      const relativeReportCssUrl = relativeReportCssPath
        .split(path.sep)
        .join("/");

      // Write HTML file
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report: ${sourceFileNameMinusExtension}</title>

    <link rel="stylesheet" href="${relativeReportCssUrl}" />

    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        #react-report-root {
            margin: 0 auto;
        }
    </style>
    <script src="${relativeReportJsUrl}"></script>
</head>
<body>
    <div id="react-report-root"></div>
    <script>
        // Wait for the bundled script to load and render the React component
        document.addEventListener('DOMContentLoaded', function() {
            // Check if renderReport function is available
            if (typeof renderReport === 'function') {
                renderReport('react-report-root', {
                    testName: '${sourceFileNameMinusExtension}',
                    runtime: '${runtime}',
                    sourceFilePath: '${sourceFilePath}',
                    testSuite: '${testsName}'
                });
            } else {
                console.error('renderReport function not found. Make sure Report.js is loaded.');
                // Try again after a short delay
                setTimeout(() => {
                    if (typeof renderReport === 'function') {
                        renderReport('react-report-root', {
                            testName: '${sourceFileNameMinusExtension}',
                            runtime: '${runtime}',
                            sourceFilePath: '${sourceFilePath}',
                            testSuite: '${testsName}'
                        });
                    } else {
                        console.error('Still unable to find renderReport.');
                    }
                }, 100);
            }
        });
    </script>
</body>
</html>`;

      fs.writeFileSync(
        htmlFilePath,
        htmlContent
        // webHtmlFrame(jsfilePath, htmlFilePath, cssFilePath)
      );
      console.log(`Generated HTML file: ${htmlFilePath}`);

      // Create directory if it doesn't exist
    }
  }
};
