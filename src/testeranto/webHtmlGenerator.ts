/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import webHtmlFrame from "../web.html";
import { IBuiltConfig } from "../Types";

export async function setupWebHtmlFiles(
  config: IBuiltConfig,
  testsName: string
) {
  const getSecondaryEndpointsPoints = (runtime: "web"): string[] => {
    return Array.from(new Set(Object.keys(config[runtime].tests || {})));
  };

  const webEndpoints = getSecondaryEndpointsPoints("web");

  await Promise.all(
    webEndpoints.map(async (sourceFilePath) => {
      const sourceFileSplit = sourceFilePath.split("/");
      const sourceDir = sourceFileSplit.slice(0, -1);
      const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
      const sourceFileNameMinusJs = sourceFileName
        .split(".")
        .slice(0, -1)
        .join(".");

      const htmlFileDir = path.join(
        "testeranto",
        "bundles",
        "web",
        testsName,
        ...sourceDir
      );
      const htmlFilePath = path.join(htmlFileDir, `${sourceFileNameMinusJs}.html`);
      const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
      const cssFilePath = `./${sourceFileNameMinusJs}.css`;

      // Create the directory and write the file
      const fullHtmlFileDir = path.join(process.cwd(), htmlFileDir);
      return fs.promises
        .mkdir(fullHtmlFileDir, { recursive: true })
        .then((x) =>
          fs.writeFileSync(
            path.join(process.cwd(), htmlFilePath),
            webHtmlFrame(jsfilePath, htmlFilePath, cssFilePath)
          )
        );
    })
  );
}
