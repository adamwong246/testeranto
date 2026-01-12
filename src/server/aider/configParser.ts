import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface AiderConfig {
  "openai-api-key"?: string;
  "anthropic-api-key"?: string;
  "api-key"?: string | string[];
  model?: string;
  "auto-commits"?: boolean;
  [key: string]: any;
}

export function parseAiderConfig(): AiderConfig | null {
  console.log("parseAiderConfig: Looking for .aider.conf.yml");
  const configPath = path.join(process.cwd(), ".aider.conf.yml");

  if (!fs.existsSync(configPath)) {
    console.log(`No .aider.conf.yml file found at ${configPath}`);
    return null;
  }

  try {
    console.log(`Found .aider.conf.yml at ${configPath}`);
    const fileContent = fs.readFileSync(configPath, "utf8");

    // Clean the content - remove any problematic characters
    const cleanedContent = fileContent
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\t/g, "  ") // Convert tabs to spaces
      .replace(/[^\x20-\x7E\n\r]/g, "") // Remove non-printable characters except newlines
      .trim();

    // Try to parse with safe load
    const config = yaml.load(cleanedContent, { json: true }) as AiderConfig;

    if (!config) {
      console.log("Config file is empty or contains only comments");
      return null;
    }

    return config;
  } catch (error: any) {
    console.error(`Failed to parse .aider.conf.yml:`, error.message);

    // Try to read the file again and log each line
    try {
      const lines = fs.readFileSync(configPath, "utf8").split("\n");
      console.error("File contents (line by line):");
      lines.forEach((line, index) => {
        console.error(`Line ${index + 1}: "${line}"`);
        // Check for problematic characters
        const hasInvalidChars = /[^\x20-\x7E]/.test(line);
        if (hasInvalidChars) {
          console.error(
            `  WARNING: Line ${index + 1} contains non-printable characters`
          );
        }
      });
    } catch (readError) {
      console.error(
        "Could not read file for line-by-line analysis:",
        readError
      );
    }

    return null;
  }
}

export function extractApiKeys(config: AiderConfig): Record<string, string> {
  // console.log("extractApiKeys");

  const apiKeys: Record<string, string> = {};

  if (!config) {
    console.log("No config provided to extractApiKeys");
    return apiKeys;
  }

  // Handle single api-key string
  if (typeof config["api-key"] === "string") {
    // console.log(`Found single api-key string: ${config["api-key"]}`);
    const [provider, key] = config["api-key"].split("=");
    if (provider && key) {
      apiKeys[provider.trim()] = key.trim();
      // console.log(`Extracted API key for provider: ${provider.trim()}`);
    }
  }

  // Handle array of api-key strings
  else if (Array.isArray(config["api-key"])) {
    console.log(`Found api-key array with ${config["api-key"].length} entries`);
    config["api-key"].forEach((keyEntry: string, index: number) => {
      // console.log(`Processing api-key entry ${index + 1}: ${keyEntry}`);
      const [provider, key] = keyEntry.split("=");
      if (provider && key) {
        apiKeys[provider.trim()] = key.trim();
        // console.log(`Extracted API key for provider: ${provider.trim()}`);
      } else {
        console.log(`Could not parse api-key entry: ${keyEntry}`);
      }
    });
  } else if (config["api-key"]) {
    console.log(
      `api-key has unexpected type: ${typeof config["api-key"]}, value: ${
        config["api-key"]
      }`
    );
  }

  // Handle individual API keys
  if (config["openai-api-key"]) {
    apiKeys["openai"] = config["openai-api-key"];
    // console.log(`Extracted OpenAI API key`);
  }

  if (config["anthropic-api-key"]) {
    apiKeys["anthropic"] = config["anthropic-api-key"];
    // console.log(`Extracted Anthropic API key`);
  }

  console.log(
    `Extracted API keys for providers: ${Object.keys(apiKeys).join(", ")}`
  );
  return apiKeys;
}

export function getApiKeyEnvironmentVariables(
  config: AiderConfig
): Record<string, string> {
  const apiKeys = extractApiKeys(config);
  const envVars: Record<string, string> = {};

  // Map provider names to environment variable names
  const providerToEnvVar: Record<string, string> = {
    openai: "OPENAI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    deepseek: "DEEPSEEK_API_KEY",
    google: "GOOGLE_API_KEY",
    groq: "GROQ_API_KEY",
    mistral: "MISTRAL_API_KEY",
    cohere: "COHERE_API_KEY",
    together: "TOGETHER_API_KEY",
  };

  for (const [provider, key] of Object.entries(apiKeys)) {
    const envVarName =
      providerToEnvVar[provider.toLowerCase()] ||
      `${provider.toUpperCase()}_API_KEY`;
    envVars[envVarName] = key;
    console.log(
      `Setting environment variable ${envVarName} for provider ${provider}`
    );
  }

  return envVars;
}
