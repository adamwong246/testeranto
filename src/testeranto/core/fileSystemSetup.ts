import fs from "fs";
import { AppHtml } from "../../utils/buildTemplates";
import { IBuiltConfig } from "../../Types";

export function setupFileSystem(config: IBuiltConfig, testsName: string) {
  // Create main index.html
  fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, AppHtml());

  // Create reports directory
  if (!fs.existsSync(`testeranto/reports/${testsName}`)) {
    fs.mkdirSync(`testeranto/reports/${testsName}`, { recursive: true });
  }

  // Write config to reports
  fs.writeFileSync(
    `testeranto/reports/${testsName}/config.json`,
    JSON.stringify(config, null, 2)
  );
}
