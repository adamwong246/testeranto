// import { ISummary } from "../Types.js";

// export function ensureSummaryEntry(
//   summary: ISummary,
//   src: string,
//   isSidecar = false
// ): void {
//   if (!summary[src]) {
//     summary[src] = {
//       typeErrors: undefined,
//       staticErrors: undefined,
//       runTimeErrors: undefined,
//       prompt: undefined,
//       failingFeatures: {},
//     };
//     if (isSidecar) {
//       // Sidecars don't need all fields
//       // delete summary[src].runTimeError;
//       // delete summary[src].prompt;
//     }
//   }
// }
