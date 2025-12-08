// import { IRunTime } from "../../Types";
// import { nodeScript } from "./nodeScript";
// import { pythonScript } from "./pythonScript";

// export default (
//   runtime: IRunTime,
//   testPath: string,
//   betterTestPath: string,
//   webSocketPort: string = "3002"
// ) => {
//   let script: string;

//   switch (runtime) {
//     case "node":
//       script = nodeScript(testPath, betterTestPath, webSocketPort);
//       break;
//     case "golang":
//       script = golangScript(testPath, betterTestPath);
//       break;
//     case "python":
//       script = pythonScript(testPath, betterTestPath);
//       break;
//     default:
//       script = `
//         echo "ERROR: Unsupported runtime: ${runtime}"
//         echo "Supported runtimes are: node, golang, python"
//         exit 1
//       `;
//       break;
//   }

//   return ["sh", "-c", script];
// };
