import fs from "fs";

import { IRunTime } from "../lib";

export default (r: IRunTime) => {
  return {
    name: "rebuild-notify",
    setup: (build) => {
      build.onStart(() => {
        console.log(`> web build starting...`);
      });
      build.onEnd((result) => {
        console.log(`> web build ended with ${result.errors.length} errors`);
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
