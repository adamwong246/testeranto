/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
export function generateDockerfile(c, runtime, testName) {
    var _a;
    if (!((_a = c[runtime]) === null || _a === void 0 ? void 0 : _a.dockerfile) || !Array.isArray(c[runtime].dockerfile)) {
        console.error(`No valid dockerfile configuration found for ${runtime}`);
        return `# No dockerfile configuration for ${runtime}`;
    }
    let dockerfileInstructions = [];
    if (Array.isArray(c[runtime].dockerfile[0]) &&
        Array.isArray(c[runtime].dockerfile[0][0])) {
        dockerfileInstructions = c[runtime].dockerfile[0];
    }
    else if (Array.isArray(c[runtime].dockerfile[0]) &&
        typeof c[runtime].dockerfile[0][0] === "string") {
        dockerfileInstructions = c[runtime].dockerfile;
    }
    else {
        console.error(`Unsupported dockerfile structure for ${runtime}`);
        return `# Unsupported dockerfile structure for ${runtime}`;
    }
    const dockerfileLines = dockerfileInstructions
        .map((line) => {
        if (Array.isArray(line)) {
            if (line[0] === "STATIC_ANALYSIS") {
                // Implement STATIC_ANALYSIS by running the provided function on files
                // For now, we'll just skip it since we don't have access to the function
                // But we can at least not output a warning
                return "# STATIC_ANALYSIS - skipped in generated Dockerfile";
            }
            else if (line[0] === "COPY") {
                // Split the source and destination
                const parts = line[1].split(" ");
                let source = parts[0];
                const destination = parts[1] || "";
                // Fix absolute paths to be relative to build context
                if (source.startsWith("/")) {
                    console.warn(`Absolute path found in COPY: ${source}, making it relative`);
                    // Remove leading slash
                    source = source.substring(1);
                }
                // Handle the specific case of "/src"
                if (source === "src" &&
                    !fs.existsSync(path.join(process.cwd(), "src"))) {
                    console.warn(`src directory not found at project root, skipping COPY`);
                    return `# COPY ${line[1]} - skipped (src not found)`;
                }
                return `${line[0]} ${source} ${destination}`.trim();
            }
            else {
                return `${line[0]} ${line[1]}`;
            }
        }
        else {
            console.warn(`Invalid dockerfile line format for ${runtime}-${testName}:`, line);
            return `# Invalid line: ${JSON.stringify(line)}`;
        }
    })
        .filter((line) => line && !line.startsWith("# STATIC_ANALYSIS - not implemented"))
        .join("\n");
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
    // Also add ENV variable to specify the runtime
    const runtimeEnv = `ENV TESTERANTO_RUNTIME=${runtime}`;
    return (dockerfileLines +
        "\n" +
        runtimeEnv + "\n" +
        "RUN mkdir -p /workspace/testeranto\n" +
        "RUN mkdir -p /workspace/testeranto/bundles\n" +
        "RUN mkdir -p /workspace/testeranto/metafiles\n" +
        "RUN mkdir -p /workspace/testeranto/reports\n");
}
