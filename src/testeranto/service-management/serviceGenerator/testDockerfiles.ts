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
  // Extract the test filename and path
  const testFileName = path.basename(testPath);
  
  // Generate Dockerfile content
  const dockerfileContent = generateDockerfile(c, runtime, testPath);
  
  // Create directory structure matching the old format
  // For example: testeranto/bundles/allTests/node/src/example/Calculator.test.ts/
  // We need to create the directory and put Dockerfile inside
  
  // Build the directory path
  const testDir = path.dirname(testPath); // e.g., src/example
  const dockerfileDir = path.join(
    process.cwd(),
    "testeranto",
    "bundles",
    "allTests",
    runtime,
    testDir,
    testFileName
  );
  
  fs.mkdirSync(dockerfileDir, { recursive: true });
  const dockerfilePath = path.join(dockerfileDir, "Dockerfile");
  fs.writeFileSync(dockerfilePath, dockerfileContent);

  // Verify the file exists
  if (!fs.existsSync(dockerfilePath)) {
    throw new Error(`Failed to create Dockerfile at ${dockerfilePath}`);
  }

  // Return the path to the Dockerfile (not the directory)
  // The old format uses the Dockerfile path directly
  const relativePath = path.relative(process.cwd(), dockerfilePath);
  // Ensure it uses forward slashes for Docker compatibility
  return relativePath.split(path.sep).join('/');
}
