import fs from "fs";
import { IRunTime } from "../Types";

export default (r: IRunTime) => {
  return {
    name: "rebuild-notify",
    setup: (build) => {
      build.onEnd((result) => {
        console.log(`${r} > build ended with ${result.errors.length} errors`);
        if (result.errors.length > 0) {
          fs.writeFileSync(
            `./testeranto/reports${r}_build_errors`,
            JSON.stringify(result, null, 2)
          );
        }
      });
    },
  };
};
