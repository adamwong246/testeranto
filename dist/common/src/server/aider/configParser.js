"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAiderConfig = parseAiderConfig;
exports.extractApiKeys = extractApiKeys;
exports.getApiKeyEnvironmentVariables = getApiKeyEnvironmentVariables;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
function parseAiderConfig() {
    console.log("parseAiderConfig: Looking for .aider.conf.yml");
    const configPath = path_1.default.join(process.cwd(), ".aider.conf.yml");
    if (!fs_1.default.existsSync(configPath)) {
        console.log(`No .aider.conf.yml file found at ${configPath}`);
        return null;
    }
    try {
        console.log(`Found .aider.conf.yml at ${configPath}`);
        const fileContent = fs_1.default.readFileSync(configPath, "utf8");
        // Clean the content - remove any problematic characters
        const cleanedContent = fileContent
            .replace(/\r\n/g, "\n") // Normalize line endings
            .replace(/\t/g, "  ") // Convert tabs to spaces
            .replace(/[^\x20-\x7E\n\r]/g, "") // Remove non-printable characters except newlines
            .trim();
        // Try to parse with safe load
        const config = js_yaml_1.default.load(cleanedContent, { json: true });
        if (!config) {
            console.log("Config file is empty or contains only comments");
            return null;
        }
        return config;
    }
    catch (error) {
        console.error(`Failed to parse .aider.conf.yml:`, error.message);
        // Try to read the file again and log each line
        try {
            const lines = fs_1.default.readFileSync(configPath, "utf8").split("\n");
            console.error("File contents (line by line):");
            lines.forEach((line, index) => {
                console.error(`Line ${index + 1}: "${line}"`);
                // Check for problematic characters
                const hasInvalidChars = /[^\x20-\x7E]/.test(line);
                if (hasInvalidChars) {
                    console.error(`  WARNING: Line ${index + 1} contains non-printable characters`);
                }
            });
        }
        catch (readError) {
            console.error("Could not read file for line-by-line analysis:", readError);
        }
        return null;
    }
}
function extractApiKeys(config) {
    // console.log("extractApiKeys");
    const apiKeys = {};
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
        config["api-key"].forEach((keyEntry, index) => {
            // console.log(`Processing api-key entry ${index + 1}: ${keyEntry}`);
            const [provider, key] = keyEntry.split("=");
            if (provider && key) {
                apiKeys[provider.trim()] = key.trim();
                // console.log(`Extracted API key for provider: ${provider.trim()}`);
            }
            else {
                console.log(`Could not parse api-key entry: ${keyEntry}`);
            }
        });
    }
    else if (config["api-key"]) {
        console.log(`api-key has unexpected type: ${typeof config["api-key"]}, value: ${config["api-key"]}`);
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
    console.log(`Extracted API keys for providers: ${Object.keys(apiKeys).join(", ")}`);
    return apiKeys;
}
function getApiKeyEnvironmentVariables(config) {
    const apiKeys = extractApiKeys(config);
    const envVars = {};
    // Map provider names to environment variable names
    const providerToEnvVar = {
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
        const envVarName = providerToEnvVar[provider.toLowerCase()] ||
            `${provider.toUpperCase()}_API_KEY`;
        envVars[envVarName] = key;
        console.log(`Setting environment variable ${envVarName} for provider ${provider}`);
    }
    return envVars;
}
