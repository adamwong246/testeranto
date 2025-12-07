import fs from "fs";
import { spawn } from "child_process";

export async function pythonTypeCheck(
  entrypoint: string,
  addableFiles: string[],
  projectName: string,
  summary: any
): Promise<void> {
  const reportDest = `testeranto/reports/${projectName}/${entrypoint
    .split(".")
    .slice(0, -1)
    .join(".")}/python`;

  if (!fs.existsSync(reportDest)) {
    fs.mkdirSync(reportDest, { recursive: true });
  }

  const typeErrorsPath = `${reportDest}/type_errors.txt`;

  // Ensure summary entry exists
  if (!summary[entrypoint]) {
    summary[entrypoint] = {
      typeErrors: undefined,
      staticErrors: undefined,
      runTimeErrors: undefined,
      prompt: undefined,
      failingFeatures: {},
    };
  }

  try {
    // Use mypy for Python type checking
    const child = spawn("mypy", [entrypoint], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    let stdout = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    return new Promise<void>((resolve) => {
      child.on("close", () => {
        const logOut = stdout + stderr;
        if (logOut.trim()) {
          fs.writeFileSync(typeErrorsPath, logOut);
          summary[entrypoint].typeErrors = logOut.split("\n").length;
        } else {
          if (fs.existsSync(typeErrorsPath)) {
            fs.unlinkSync(typeErrorsPath);
          }
          summary[entrypoint].typeErrors = 0;
        }
        resolve();
      });
    });
  } catch (error: any) {
    console.error(`Error running mypy on ${entrypoint}:`, error);
    fs.writeFileSync(typeErrorsPath, `Error running mypy: ${error.message}`);
    summary[entrypoint].typeErrors = -1;
  }
}
