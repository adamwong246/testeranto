import path from "path";
import fs from "fs";
import { IRunTime } from "./Types";
import webHtmlFrame from "./web.html";
import config from "../allTests";

const getSecondaryEndpointsPoints = (runtime: IRunTime): string[] => {
  // Access the config properly
  const runtimeConfig = config[runtime as keyof typeof config];
  if (!runtimeConfig || !runtimeConfig.tests) {
    return [];
  }
  return Object.keys(runtimeConfig.tests);
};

export const makeHtmlTestFiles = (testsName: string) => {
  const webTests = [...getSecondaryEndpointsPoints("web")];
  for (const sourceFilePath of webTests) {
    const sourceFileSplit = sourceFilePath.split("/");
    const sourceDir = sourceFileSplit.slice(0, -1);
    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
    const sourceFileNameMinusJs = sourceFileName
      .split(".")
      .slice(0, -1)
      .join(".");

    const htmlFilePath = path.normalize(
      `${process.cwd()}/testeranto/bundles/${testsName}/${sourceDir.join(
        "/"
      )}/${sourceFileNameMinusJs}.html`
    );
    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
    const cssFilePath = `./${sourceFileNameMinusJs}.css`;

    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });

    // Write HTML file
    fs.writeFileSync(
      htmlFilePath,
      webHtmlFrame(jsfilePath, htmlFilePath, cssFilePath)
    );
    console.log(`Generated HTML file: ${htmlFilePath}`);
  }
};
