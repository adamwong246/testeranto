import fs from "fs";

export default (tests: Promise<any>[]) =>
  Promise.all(tests).then(async (x) => {
    const suites = x.flat().map(async (suite) => {
      let status;
      try {
        await suite.runner();
        status = "pass";
      } catch (e) {
        console.error(e);
        status = e;
      }

      return {
        test: suite.test,
        status,
      };
    });

    Promise.all(suites).then((result) => {
      fs.writeFile(
        "./dist/testerantoResults.txt",
        JSON.stringify(result, null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }

          const failures = result.filter((r) => r.status != "pass");

          if (failures.length) {
            console.warn(
              `❌ You have failing tests: ${JSON.stringify(
                failures.map((f) => f.test.name)
              )}`
            );
            process.exit(-1);
          } else {
            console.log("✅ All tests passed ");
            process.exit(0);
          }
        }
      );
    });
  });
