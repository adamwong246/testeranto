import { execSync } from "child_process";

export const validateDockerEnvironment = (stdout, stderr): string => {
  stdout("🔍 Checking if Docker daemon is running...");
  try {
    execSync("docker info", { stdio: "pipe" });
    stdout("✅ Docker daemon is running");
  } catch (dockerErr) {
    stderr("❌ Docker daemon is not running or not accessible");
    // stderr("Please start Docker Desktop or the Docker service");
    throw new Error("Docker daemon is not running");
  }

  // Check if docker-compose is available
  stdout("🔍 Checking if docker-compose is available...");
  let composeCommand = "docker-compose";
  try {
    execSync("docker-compose --version", { stdio: "pipe" });
    stdout("✅ docker-compose is available");
  } catch (composeErr) {
    stdout("⚠️ docker-compose command not found, trying docker compose...");
    try {
      execSync("docker compose version", { stdio: "pipe" });
      composeCommand = "docker compose";
      stdout("✅ docker compose (v2) is available");
    } catch (dockerComposeErr) {
      stderr("❌ Neither docker-compose nor docker compose are available");
      // stderr("Please install docker-compose or Docker Compose v2");
      throw new Error("docker-compose not available");
    }
  }

  return composeCommand;
};

export const validateDockerFile = (
  stdout,
  stderr,
  composeCommand,
  composeFile,
  composeDir
): boolean => {
  // const log = logger?.log || console.log;
  // const error = logger?.error || console.error;

  // Validate docker-compose file
  stdout("🔍 Validating docker-compose file...");
  try {
    execSync(`${composeCommand} -f "${composeFile}" config`, {
      stdio: "pipe",
      cwd: composeDir,
    });
    stdout("✅ Docker Compose file is valid");
  } catch (validateErr) {
    stderr(
      "❌ Docker Compose file validation failed:",
      (validateErr as Error).message
    );
    stderr("Please check the docker-compose file for errors");
    throw new Error("Docker Compose file validation failed");
  }
  return true;

  // stdout("🔍 Checking if Docker daemon is running...");
  // try {
  //   execSync("docker info", { stdio: "pipe" });
  //   stdout("✅ Docker daemon is running");
  // } catch (dockerErr) {
  //   stderr("❌ Docker daemon is not running or not accessible");
  //   // stderr("Please start Docker Desktop or the Docker service");
  //   throw new Error("Docker daemon is not running");
  // }

  // // Check if docker-compose is available
  // stdout("🔍 Checking if docker-compose is available...");
  // let composeCommand = "docker-compose";
  // try {
  //   execSync("docker-compose --version", { stdio: "pipe" });
  //   stdout("✅ docker-compose is available");
  // } catch (composeErr) {
  //   stdout("⚠️ docker-compose command not found, trying docker compose...");
  //   try {
  //     execSync("docker compose version", { stdio: "pipe" });
  //     composeCommand = "docker compose";
  //     stdout("✅ docker compose (v2) is available");
  //   } catch (dockerComposeErr) {
  //     stderr("❌ Neither docker-compose nor docker compose are available");
  //     // stderr("Please install docker-compose or Docker Compose v2");
  //     throw new Error("docker-compose not available");
  //   }
  // }

  // return composeCommand;
};
