import fs from "fs";
import { ITest, ITestResults } from "./testShapes";

const processTestsWithPorts = async (
  tests: ITest[],
  ports: number[]
): Promise<ITestResults> => {
  const testsStack = tests;
  return (
    await Promise.all(
      ports.map(async (port: number) => {
        return new Promise<ITestResults>((res, rej) => {
          const popper = async (payload) => {
            if (testsStack.length === 0) {
              res(payload);
            } else {
              const suite = testsStack.pop();
              try {
                await suite?.runner({ port });
                popper([
                  ...payload,
                  {
                    test: suite?.test,
                    status: "pass",
                  },
                ]);
              } catch (e) {
                console.error(e);
                popper([
                  ...payload,
                  {
                    test: suite?.test,
                    status: e,
                  },
                ]);
              }
            }
          };
          popper([]);
        });
      })
    )
  ).flat();
};

export const reporter = async (
  tests: Promise<ITest>[],

  testResources: {
    ports: number[];
  }
) => {
  await Promise.all(tests).then(async (x) => {
    const suites = x.flat();

    // const testsWithoutResources: ITestResults = suites
    //   .filter((s) => !s.testResource)
    //   .map(async (suite) => {
    //     let status;
    //     try {
    //       await suite.runner({});
    //       status = "pass";
    //     } catch (e) {
    //       console.error(e);
    //       status = e;
    //     }

    //     return {
    //       test: suite.test,
    //       status,
    //     };
    //   });

    const portTestresults = await processTestsWithPorts(
      suites.filter((s) => s.testResource === "port"),
      testResources.ports
    );

    // console.log("portTestresults", suites.filter((s) => s.testResource === "port"))

    // Promise.all([
    //   ...testsWithoutResources,
    //   ...portTestresults
    // ]).then(
    //   (result) => {
    //     fs.writeFile(
    //       "./dist/testerantoResults.txt",
    //       JSON.stringify(result, null, 2),
    //       (err) => {
    //         if (err) {
    //           console.error(err);
    //         }

    //         const failures = result.filter((r) => r.status != "pass");

    //         if (failures.length) {
    //           console.warn(
    //             `❌ You have failing tests: ${JSON.stringify(
    //               failures.map((f) => f.test.name)
    //             )}`
    //           );
    //           process.exit(-1);
    //         } else {
    //           console.log("✅ All tests passed ");
    //           process.exit(0);
    //         }
    //       }
    //     );
    //   }
    // );
  });
};
