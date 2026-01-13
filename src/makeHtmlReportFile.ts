import path from "path";
import fs from "fs";
import { IBuiltConfig } from "./Types";
import {
  getSecondaryEndpointsPoints,
  getApplicableRuntimes,
  generateHtmlContent,
} from "./htmlReportLogic";

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

    // Get only the runtimes that actually have this test
    const applicableRuntimes = getApplicableRuntimes(config, sourceFilePath);

    console.log(
      `Test "${sourceFilePath}" applicable to runtimes: ${applicableRuntimes.join(
        ", "
      )}`
    );

    for (const runtime of applicableRuntimes) {
      const htmlFilePath = path.normalize(
        `${process.cwd()}/testeranto/reports/${testsName}/${sourceDir.join(
          "/"
        )}/${sourceFileNameMinusExtension}/${runtime}/index.html`
      );

      fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });

      // Calculate relative paths
      const htmlDir = path.dirname(htmlFilePath);
      const reportJsPath = path.join(
        process.cwd(),
        "dist",
        "prebuild",
        "Report.js"
      );
      const relativeReportJsPath = path.relative(htmlDir, reportJsPath);
      const relativeReportJsUrl = relativeReportJsPath
        .split(path.sep)
        .join("/");

      const reportCssPath = path.join(
        process.cwd(),
        "dist",
        "prebuild",
        "style.css"
      );
      const relativeReportCssPath = path.relative(htmlDir, reportCssPath);
      const relativeReportCssUrl = relativeReportCssPath
        .split(path.sep)
        .join("/");

      // Generate HTML content using the logic module
      const htmlContent = generateHtmlContent({
        sourceFileNameMinusExtension,
        relativeReportCssUrl,
        relativeReportJsUrl,
        runtime,
        sourceFilePath,
        testsName,
      });

      fs.writeFileSync(htmlFilePath, htmlContent);
      console.log(`Generated HTML file: ${htmlFilePath}`);
    }
  }
};
