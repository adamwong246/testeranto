"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configParser_1 = require("./configParser");
// Add this helper function at the top of the file
function loadAiderApiKeys() {
    try {
        console.log("Attempting to load API keys from .aider.conf.yml...");
        const config = (0, configParser_1.parseAiderConfig)();
        if (config) {
            const envVars = (0, configParser_1.getApiKeyEnvironmentVariables)(config);
            if (Object.keys(envVars).length > 0) {
                console.log("Successfully loaded API keys from .aider.conf.yml");
                return envVars;
            }
            else {
                console.log("No API keys found in .aider.conf.yml");
            }
        }
        else {
            console.log("Could not parse .aider.conf.yml or file not found");
        }
    }
    catch (error) {
        console.error("Failed to load API keys from .aider.conf.yml:", error);
    }
    return {};
}
// This file is no longer needed as we're not using a separate aider-pool container
// Each test will start its own aider process directly
exports.default = {};
