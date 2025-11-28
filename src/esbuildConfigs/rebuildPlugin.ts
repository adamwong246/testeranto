import fs from "fs";
import path from 'path';
import { IRunTime } from "../lib";

export default (r: IRunTime) => {
  return {
    name: "rebuild-notify",
    setup: (build) => {
      build.onEnd((result) => {
        console.log(`${r} > build ended with ${result.errors.length} errors`);
        if (result.errors.length > 0) {
          const errorFile = path.join(process.cwd(), `testeranto/reports${r}_build_errors`);
          fs.writeFileSync(
            errorFile,
            JSON.stringify(result, null, 2)
          );
        }
      });
    },
  };
};
