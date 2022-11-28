// import Rectangle from "./Rectangle/Rectangle.test";
import LoginSelector from "./Redux+Reselect+React/LoginSelector.test";
import LoginStore from "./Redux+Reselect+React/LoginStore.test";
import LoginPage from "./Redux+Reselect+React/LoginPage.test";
import HttpServerTests from "./httpServer/server.test";

import reporter from "../src/reporter";

reporter([
  LoginStore(),
  LoginSelector(),
  // Rectangle(),
  LoginPage(),
  HttpServerTests(),
]);

export {};

// Promise.all([
//   LoginStore(),
//   LoginSelector(),
//   // Rectangle(),
//   LoginPage(),
//   HttpServerTests(),
// ]).then(async (x) => {
//   const suites = x.flat().map(async (suite) => {
//     let status;
//     try {
//       await suite.runner();
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

//   Promise.all(suites).then((result) => {
//     fs.writeFile(
//       "./dist/testerantoResults.txt",
//       JSON.stringify(result, null, 2),
//       (err) => {
//         if (err) {
//           console.error(err);
//         }
//         console.log("goodbye");
//         process.exit(0);
//       }
//     );
//   });
// });
