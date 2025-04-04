import { LintResult } from "eslint/lib/linter";

export default function (results: LintResult[]) {
  return JSON.stringify(results, null, 2);
}
