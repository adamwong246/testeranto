import fs from "fs";
import path from "path";
import { generateDockerfile } from "../dockerfileGenerator";
export function setupDockerfileForTest(c, runtime, testName, testsName) {
    const dockerfileContent = generateDockerfile(c, runtime, testName);
    const dockerfileName = "Dockerfile";
    // The path should be relative to the current working directory
    const dockerfileDir = path.join("testeranto", "bundles", testsName, runtime, testName);
    const dockerfilePath = path.join(dockerfileDir, dockerfileName);
    // Ensure we're not writing outside of testeranto/bundles
    const normalizedDir = path.normalize(dockerfileDir);
    if (!normalizedDir.startsWith(path.join("testeranto", "bundles"))) {
        throw new Error(`Invalid Dockerfile directory: ${dockerfileDir}. Must be under testeranto/bundles/`);
    }
    // Create the directory and write the file
    const fullDockerfileDir = path.join(process.cwd(), dockerfileDir);
    fs.mkdirSync(fullDockerfileDir, { recursive: true });
    const fullDockerfilePath = path.join(process.cwd(), dockerfilePath);
    fs.writeFileSync(fullDockerfilePath, dockerfileContent);
    // Verify the file exists
    if (!fs.existsSync(fullDockerfilePath)) {
        throw new Error(`Failed to create Dockerfile at ${fullDockerfilePath}`);
    }
    return dockerfileDir;
}
