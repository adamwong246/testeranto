/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // Run flake8 inside a Docker container to ensure consistent environment
    // Use the same Python image as defined in allTests.ts
    const dockerImage = "python:3.11-alpine";
    const dockerCommand = [
      "docker",
      "run",
      "--rm",
      "-v",
      `${process.cwd()}:/workspace`,
      "-w",
      "/workspace",
      dockerImage,
      "sh",
      "-c",
      `pip install flake8 > /dev/null 2>&1 && flake8 "${entrypoint}" --max-line-length=88`,
    ];

    const child = spawn(dockerCommand[0], dockerCommand.slice(1), {
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
      child.on("close", (code) => {
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
    console.error(`Error running flake8 in Docker on ${entrypoint}:`, error);
    fs.writeFileSync(lintErrorsPath, `Error running flake8: ${error.message}`);
    summary[entrypoint].staticErrors = -1;
  }
}
