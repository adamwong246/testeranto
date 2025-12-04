import fs from "fs";
import path from "path";
import { IBuiltConfig, IRunTime } from "../../../Types";
import { generateDockerfile } from "../../configuration/dockerfileGenerator";

export function setupDockerfileForTest(
  c: IBuiltConfig,
  runtime: IRunTime,
  testPath: string,
  testsName: string
): string {
  // Extract just the filename without path for directory naming
  const testFileName = path.basename(testPath);
  const testNameWithoutExt = testFileName.replace(/\.[^/.]+$/, '');
  
  const dockerfileContent = generateDockerfile(c, runtime, testPath);
  const dockerfileName = "Dockerfile";
  // Use testNameWithoutExt for directory, not the full path
  const dockerfileDir = path.join(
    process.cwd(),
    "testeranto",
    "bundles",
    testsName,
    runtime,
    testNameWithoutExt
  );
  const dockerfilePath = path.join(dockerfileDir, dockerfileName);

  // Ensure we're not writing outside of testeranto/bundles
  const normalizedDir = path.normalize(dockerfileDir);
  const bundlesPath = path.join(process.cwd(), "testeranto", "bundles");
  if (!normalizedDir.startsWith(bundlesPath)) {
    throw new Error(
      `Invalid Dockerfile directory: ${dockerfileDir}. Must be under ${bundlesPath}`
    );
  }

  // Create the directory and write the file
  fs.mkdirSync(dockerfileDir, { recursive: true });
  fs.writeFileSync(dockerfilePath, dockerfileContent);

  // Verify the file exists
  if (!fs.existsSync(dockerfilePath)) {
    throw new Error(`Failed to create Dockerfile at ${dockerfilePath}`);
  }

  // Return relative path from process.cwd() for use in docker-compose.yml
  const relativePath = path.relative(process.cwd(), dockerfileDir);
  // Ensure it uses forward slashes for Docker compatibility
  return relativePath.split(path.sep).join('/');
}
