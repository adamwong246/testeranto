/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";

export const processGoTestOutput = (reportDest: string, src: string) => {
  const testsJsonPath = `${reportDest}/tests.json`;

  // Parse the stdout.log to extract test results from JSON output
  const stdoutPath = `${reportDest}/stdout.log`;
  if (fs.existsSync(stdoutPath)) {
    try {
      const stdoutContent = fs.readFileSync(stdoutPath, "utf-8");
      const lines = stdoutContent.split("\n").filter((line) => line.trim());

      const testResults = {
        tests: [],
        features: [],
        givens: [],
        fullPath: path.resolve(process.cwd(), src),
      };

      // Parse each JSON line from go test output
      for (const line of lines) {
        try {
          const event = JSON.parse(line);
          if (event.Action === "pass" || event.Action === "fail") {
            testResults.tests.push({
              name: event.Test || event.Package,
              status: event.Action === "pass" ? "passed" : "failed",
              time: event.Elapsed ? `${event.Elapsed}s` : "0s",
            });
          }
        } catch (e) {
          // Skip non-JSON lines
        }
      }

      fs.writeFileSync(testsJsonPath, JSON.stringify(testResults, null, 2));
      return;
    } catch (error) {
      console.error("Error processing go test output:", error);
    }
  }
};
