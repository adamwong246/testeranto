// import { IChecks } from "./src/Types";

// export const NODE_STATIC_ANALYSIS: IChecks = {
//   eslint: [
//     [
//       ["WORKDIR", "/workspace"],
//       [
//         "RUN",
//         "npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin",
//       ],
//     ],
//     "npx eslint src/ --ext .ts,.tsx --max-warnings=0",
//   ],
//   typescript: [
//     [
//       ["WORKDIR", "/workspace"],
//       ["RUN", "npm install --save-dev typescript"],
//     ],
//     "npx tsc --noEmit",
//   ],
//   "audit-ci": [
//     [
//       ["WORKDIR", "/workspace"],
//       ["RUN", "npm install --save-dev audit-ci"],
//     ],
//     "npx audit-ci --critical",
//   ],
//   depcheck: [
//     [
//       ["WORKDIR", "/workspace"],
//       ["RUN", "npm install --save-dev depcheck"],
//     ],
//     "npx depcheck",
//   ],
// };

export const nodeConfig = {
  // flavor: ["interpreted", "node:20.19.4-alpine"] as [
  //   "compiled" | "interpreted" | "VM" | "chrome",
  //   string
  // ],
  // testFile: "example/Calculator.test.ts",
  options: {
    processPool: {
      maxConcurrent: 5,
      timeoutMs: 25000,
    },
    check: "NODE_STATIC_ANALYSIS",
  },
};
