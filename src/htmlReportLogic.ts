import { IBuiltConfig } from "./Types";

export const getSecondaryEndpointsPoints = (config: IBuiltConfig): string[] => {
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

// Helper function to get applicable runtimes for a test
export const getApplicableRuntimes = (
  config: IBuiltConfig,
  testPath: string
): string[] => {
  const runtimes: string[] = [];

  // Check each runtime to see if the test exists in its configuration
  for (const runtime of ["node", "web", "golang", "python"]) {
    const runtimeConfig = config[runtime as keyof typeof config];
    if (runtimeConfig && runtimeConfig.tests) {
      // Check if this test path exists in the runtime's tests
      if (Object.keys(runtimeConfig.tests).includes(testPath)) {
        runtimes.push(runtime);
      }
    }
  }

  return runtimes;
};

export interface HtmlGenerationParams {
  sourceFileNameMinusExtension: string;
  relativeReportCssUrl: string;
  relativeReportJsUrl: string;
  runtime: string;
  sourceFilePath: string;
  testsName: string;
}

export const generateHtmlContent = (params: HtmlGenerationParams): string => {
  const {
    sourceFileNameMinusExtension,
    relativeReportCssUrl,
    relativeReportJsUrl,
    runtime,
    sourceFilePath,
    testsName,
  } = params;

  return `<!DOCTYPE html>
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
};
