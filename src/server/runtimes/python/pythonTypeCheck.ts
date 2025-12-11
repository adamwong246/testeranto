/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // Run mypy inside a Docker container to ensure consistent environment
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
      `pip install mypy > /dev/null 2>&1 && mypy "${entrypoint}"`,
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
    console.error(`Error running mypy in Docker on ${entrypoint}:`, error);
    fs.writeFileSync(typeErrorsPath, `Error running mypy: ${error.message}`);
    summary[entrypoint].typeErrors = -1;
  }
}
