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
                    status: "fail",
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

    const testsWithoutResources: ITestResults = suites
      .filter((s) => s.testResource === "na")
      .map(async (suite) => {
        let status;
        try {
          const x = await suite.runner({});
          console.log("x", x)
          status = "pass";
        } catch (e) {
          console.error(e);
          status = "fail";
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return {
            test: suite.test,
            status,
          };
        }

        
      });

    // const portTestresults = await processTestsWithPorts(
    //   suites.filter((s) => s.testResource === "port"),
    //   testResources.ports
    // );

    Promise.all([
      ...testsWithoutResources,
      // ...portTestresults
    ]).then(
      (result) => {
        fs.writeFile(
          "./dist/testerantoResults.txt",
          JSON.stringify(result, null, 2),
          (err) => {
            if (err) {
              console.error(err);
              process.exit(-1)
            }
            process.exit(0)
          }
        );
      }
    );
  });
};
