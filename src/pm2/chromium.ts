import pm2 from "pm2";
import { IBaseConfig } from "../Types";
import path from "path";

export default (
  args: string,
  inputFilePath: string,
  watch: string,
  config: IBaseConfig
): pm2.StartOptions => {

  const htmlFileAndQueryParams = `file://${path.resolve(watch)}\?requesting='${encodeURIComponent(JSON.stringify(
    {
      scheduled: true,
      name: inputFilePath,
      ports: [],
      fs:
        path.resolve(
          process.cwd(),
          config.outdir,
          "web",
          inputFilePath,
        ),
    }
  ))}`;

  return {
    script: `chromium --allow-file-access-from-files --allow-file-access --allow-cross-origin-auth-prompt ${htmlFileAndQueryParams}' --load-extension=./node_modules/testeranto/dist/chromeExtension`,
    name: inputFilePath,
    autorestart: false,
    args,
    watch: [watch],
  }
};

