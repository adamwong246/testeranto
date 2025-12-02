/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../Types";

export function generateDockerfile(
  c: IBuiltConfig,
  runtime: IRunTime,
  testName: string
): string {
  if (!c[runtime]?.dockerfile || !Array.isArray(c[runtime].dockerfile)) {
    console.error(`No valid dockerfile configuration found for ${runtime}`);
    return `# No dockerfile configuration for ${runtime}`;
  }

  console.log(
    `Dockerfile config for ${runtime}:`,
    JSON.stringify(c[runtime].dockerfile, null, 2)
  );

  let dockerfileInstructions: any[] = [];

  if (
    Array.isArray(c[runtime].dockerfile[0]) &&
    Array.isArray(c[runtime].dockerfile[0][0])
  ) {
    dockerfileInstructions = c[runtime].dockerfile[0];
  } else if (
    Array.isArray(c[runtime].dockerfile[0]) &&
    typeof c[runtime].dockerfile[0][0] === "string"
  ) {
    dockerfileInstructions = c[runtime].dockerfile;
  } else {
    console.error(`Unsupported dockerfile structure for ${runtime}`);
    return `# Unsupported dockerfile structure for ${runtime}`;
  }

  const dockerfileLines = dockerfileInstructions
    .map((line) => {
      if (Array.isArray(line)) {
        if (line[0] === "STATIC_ANALYSIS") {
          console.warn(
            `STATIC_ANALYSIS found but not implemented for ${runtime}-${testName}`
          );
          return "# STATIC_ANALYSIS - not implemented";
        } else if (line[0] === "COPY") {
          // Split the source and destination
          const parts = line[1].split(" ");
          let source = parts[0];
          const destination = parts[1] || "";

          // Fix absolute paths to be relative to build context
          if (source.startsWith("/")) {
            console.warn(
              `Absolute path found in COPY: ${source}, making it relative`
            );
            // Remove leading slash
            source = source.substring(1);
          }

          // Handle the specific case of "/src"
          if (
            source === "src" &&
            !fs.existsSync(path.join(process.cwd(), "src"))
          ) {
            console.warn(
              `src directory not found at project root, skipping COPY`
            );
            return `# COPY ${line[1]} - skipped (src not found)`;
          }

          return `${line[0]} ${source} ${destination}`.trim();
        } else {
          return `${line[0]} ${line[1]}`;
        }
      } else {
        console.warn(
          `Invalid dockerfile line format for ${runtime}-${testName}:`,
          line
        );
        return `# Invalid line: ${JSON.stringify(line)}`;
      }
    })
    .filter(
      (line) => line && !line.startsWith("# STATIC_ANALYSIS - not implemented")
    )
    .join("\n");

  console.log(`Generated Dockerfile for ${runtime}-${testName}:`);
  console.log(dockerfileLines);
  console.log("---");

  // if (!dockerfileLines || dockerfileLines.trim().length === 0) {
  //   console.warn(
  //     `Generated empty Dockerfile for ${runtime}-${testName}, using fallback`
  //   );
  //   return `FROM ${
  //     runtime === "node"
  //       ? "node:18-alpine"
  //       : runtime === "python"
  //       ? "node:18-alpine"
  //       : runtime === "golang"
  //       ? "node:18-alpine"
  //       : "alpine:latest"
  //   }\nWORKDIR /app\nRUN mkdir -p /workspace/testeranto/metafiles\nCOPY . .\n`;
  // }

  // Add the directory creation to the end of the Dockerfile
  return (
    dockerfileLines +
    "\nRUN mkdir -p /workspace/testeranto\n" +
    "RUN mkdir -p /workspace/testeranto/bundles\n" +
    "RUN mkdir -p /workspace/testeranto/metafiles\n" +
    "RUN mkdir -p /workspace/testeranto/reports\n"
  );
}
