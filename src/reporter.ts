import fs from "fs";
import { BaseGiven, BaseCheck } from "./base/level0/AbstractClasses";

type ITest = {
  test: {
    name: string;
    givens: BaseGiven<any, any, any>[];
    checks: BaseCheck<any, any, any>[];
  };
  runner: (testResurce?) => any;
  testResource: any;
};

type ITestResults = Promise<{
  test: {
    name: string;
    givens: BaseGiven<any, any, any>[];
    checks: BaseCheck<any, any, any>[];
  };
  status: any;
}>[];

const processPortyTests = async (
  tests: ITest[],
  ports: number[]
): Promise<ITestResults> => {
  let testsStack = tests;

  const x = ports.map(async (port: number) => {
    const porter = new Promise<ITestResults>((res, rej) => {
      let x;

      const popper = async (payload) => {
        if (testsStack.length === 0) {
          res(payload);
        } else {
          const suite = testsStack.pop();
          let status;
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

    return await porter;
  });

  return (await Promise.all(x)).flat();
};

export default async (
  tests: Promise<ITest>[],

  testResources: {
    ports: number[];
  }
) => {
  Promise.all(tests).then(async (x) => {
    const suites = x.flat();

    const testsWithoutResources: ITestResults = suites
      .filter((s) => !s.testResource)
      .map(async (suite) => {
        let status;
        try {
          await suite.runner({});
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

    const portTests = suites.filter((s) => s.testResource === "port");

    const portTestresults = await processPortyTests(
      portTests,
      testResources.ports
    );

    Promise.all([...testsWithoutResources, ...portTestresults]).then(
      (result) => {
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
      }
    );
  });
};

// const portResources = {
//   3000: false,
//   3001: false,
// };

// for (let portTest of portTests) {
//   if (portResources[3000] === false) {
//     portResources[3000] = true;
//   } else if (portResources[3001] === false) {
//     portResources[3001] = true;
//   } else {

//   }
// }

// const portTests = suites
//   .filter((s) => s.testResource === "port")
//   .map(async (suite) => {
//     let status;
//     // try {
//     //   await suite.runner();
//     //   status = "pass";
//     // } catch (e) {
//     //   console.error(e);
//     //   status = e;
//     // }

//     return {
//       test: suite.test,
//       status,
//     };
//   });
