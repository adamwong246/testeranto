/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path";
import { IBuiltConfig, IRunTime } from "../../Types";

export async function generateTestServices(
  config: IBuiltConfig,
  runtimes: IRunTime[]
): Promise<Record<string, any>> {
  // In the new architecture, tests run in process pool services
  // This function is kept for compatibility but returns empty
  return {};
}
