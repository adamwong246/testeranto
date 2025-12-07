import fs from "fs";
import { spawn } from "child_process";

export async function pythonLintCheck(
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

  const lintErrorsPath = `${reportDest}/lint_errors.txt`;

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
    // Use flake8 for Python linting
    const child = spawn("flake8", [entrypoint, "--max-line-length=88"], {
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
          fs.writeFileSync(lintErrorsPath, logOut);
          summary[entrypoint].staticErrors = logOut.split("\n").length;
        } else {
          if (fs.existsSync(lintErrorsPath)) {
            fs.unlinkSync(lintErrorsPath);
          }
          summary[entrypoint].staticErrors = 0;
        }
        resolve();
      });
    });
  } catch (error: any) {
    console.error(`Error running flake8 on ${entrypoint}:`, error);
    fs.writeFileSync(
      lintErrorsPath,
      `Error running flake8: ${error.message}`
    );
    summary[entrypoint].staticErrors = -1;
  }
}
