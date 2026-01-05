import {
  parseAiderConfig,
  getApiKeyEnvironmentVariables,
} from "../aider/configParser";

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

export default {
  image: "paulgauthier/aider-full:latest",
  restart: "unless-stopped",
  environment: {
    PYTHONUNBUFFERED: "1",
    AIDER_POOL_HOST: "0.0.0.0",
    AIDER_POOL_PORT: "8765",
    // Load API keys from .aider.conf.yml (will be empty if parsing fails)
    ...loadAiderApiKeys(),
    GIT_AUTHOR_NAME: "Testeranto Bot",
    GIT_AUTHOR_EMAIL: "bot@testeranto.local",
    GIT_COMMITTER_NAME: "Testeranto Bot",
    GIT_COMMITTER_EMAIL: "bot@testeranto.local",
  },
  networks: ["default"],
  volumes: [
    `${process.cwd()}:/workspace`,
    // "node_modules:/workspace/node_modules",
    "/var/run/docker.sock:/var/run/docker.sock",
    // Mount the aider config file so aider can read it directly if needed
    `${process.cwd()}/.aider.conf.yml:/workspace/.aider.conf.yml:ro`,
  ],
  working_dir: "/workspace",
  ports: ["8765:8765", "9000-9100:9000-9100"],
  // command: [
  //   "sh",
  //   "-c",
  //   `

  //   pwd
  //   ls -al
  // `,
  // ],
};
