"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pure_1 = __importDefault(require("../../Pure"));
const core_test_specification_1 = require("./core.test.specification");
const core_test_implementation_1 = require("./core.test.implementation");
const core_test_adapter_1 = require("./core.test.adapter");
const MockCore_1 = require("./MockCore");
exports.default = (0, Pure_1.default)(MockCore_1.MockCore.prototype, core_test_specification_1.specification, core_test_implementation_1.implementation, core_test_adapter_1.testAdapter);
// console.log("[DEBUG] Starting core.test.ts");
// console.log("[DEBUG] MockCore:", MockCore?.name);
// console.log("[DEBUG] specification:", specification?.name);
// console.log("[DEBUG] implementation keys:", Object.keys(implementation));
// console.log("[DEBUG] testAdapter keys:", Object.keys(testAdapter));
// console.log("[DEBUG] Starting test runner with:");
// console.log("- Specification:", specification?.name);
// console.log("- Implementation keys:", Object.keys(implementation));
// console.log("- Test adapter keys:", Object.keys(testAdapter));
// console.log("[DEBUG] Creating test runner instance...");
// try {
//   const testRunner = new Testeranto<I, O, M>(
//     MockCore.prototype,
//     specification,
//     implementation,
//     { ports: [3000, 3001] },
//     testAdapter
//   );
//   console.log("[DEBUG] Starting test execution...");
//   const runTests = async () => {
//     try {
//       const result = await testRunner.receiveTestResourceConfig(
//         JSON.stringify({
//           name: "core.test",
//           fs: "/tmp/core.test",
//           ports: [3000, 3001],
//         })
//       );
//       console.log("[DEBUG] Test run completed with:");
//       console.log("- Status:", result.failed ? "FAILED" : "PASSED");
//       console.log("- Failures:", result.fails);
//       console.log("- Features tested:", result.features?.length);
//       console.log("- Artifacts:", result.artifacts?.length);
//       if (result.failed) {
//         throw new Error(`Tests failed with ${result.fails} failures`);
//       }
//       return result;
//     } catch (e) {
//       console.error("[ERROR] Test runner failed:", e.message);
//       console.error("- Full error:", e);
//       process.exit(1);
//     }
//   };
//   // Run tests immediately when imported
//   runTests().catch(e => {
//     console.error("[ERROR] Test runner failed:", e);
//     process.exit(1);
//   });
// } catch (e) {
//   console.error("[ERROR] Failed to initialize test runner:", e);
//   process.exit(1);
// }
