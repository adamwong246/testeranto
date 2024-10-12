import path from "path";
import pm2 from "pm2";
import { config } from "process";
import { IBaseConfig } from "../Types";

export default (
  args: string,
  inputFilePath: string,
  watch: string,
  config: IBaseConfig
): pm2.StartOptions => {

  return {
    name: inputFilePath,
    script: `node ${config.debugger ? "--inspect-brk" : ""} ${watch} '${JSON.stringify(
      {
        scheduled: true,
        name: inputFilePath,
        ports: [],
        fs:
          path.resolve(
            process.cwd(),
            config.outdir,
            "node",
            inputFilePath
          ),
      }
    )}'`,
    autorestart: false,
    watch: [watch],
    args

  }
};