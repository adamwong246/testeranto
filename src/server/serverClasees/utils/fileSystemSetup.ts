import fs from "fs";
import {
  IndexHtml,
  ProcessMangerHtml,
} from "../../../clients/utils/buildTemplates";
import { IBuiltConfig } from "../../../Types";

export function setupFileSystem(config: IBuiltConfig, testsName: string) {
  fs.writeFileSync(
    `${process.cwd()}/testeranto/ProcessManger.html`,
    ProcessMangerHtml()
  );

  fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, IndexHtml());

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
