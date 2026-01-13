import {
  parseAiderConfig,
  getApiKeyEnvironmentVariables,
} from "./configParser";

// Add this helper function at the top of the file
function loadAiderApiKeys(): Record<string, string> {
  try {
    console.log("Attempting to load API keys from .aider.conf.yml...");
    const config = parseAiderConfig();
    if (config) {
      const envVars = getApiKeyEnvironmentVariables(config);
      if (Object.keys(envVars).length > 0) {
        console.log("Successfully loaded API keys from .aider.conf.yml");
        return envVars;
      } else {
        console.log("No API keys found in .aider.conf.yml");
      }
    } else {
      console.log("Could not parse .aider.conf.yml or file not found");
    }
  } catch (error) {
    console.error("Failed to load API keys from .aider.conf.yml:", error);
  }
  return {};
}

// This defines the base aider image upon which the aider process-containers are built
export const AiderDockerFile = [
  `FROM python:3.11-slim`,
  `WORKDIR /workspace`,
  `RUN pip install --no-cache-dir aider-chat`,
  `# Create a non-root user for security`,
  `RUN useradd -m -u 1000 aider && chown -R aider:aider /workspace`,
  `USER aider`,
  `# Copy API keys if they exist in the host's .aider.conf.yml`,
  `# The actual API keys will be passed as environment variables at runtime`,
  `# Default command starts aider in interactive mode`,
  `CMD ["aider", "--yes", "--dark-mode"]`
];

// This file is no longer needed as we're not using a separate aider-pool container
// Each test will start its own aider process directly
export default {};
