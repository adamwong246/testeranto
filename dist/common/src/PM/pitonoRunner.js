"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitonoRunner = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class PitonoRunner {
    constructor(config, testName) {
        this.config = config;
        this.testName = testName;
    }
    async run() {
        const coreJsonPath = path_1.default.join(process.cwd(), 'testeranto', 'pitono', this.testName, 'core.json');
        // Wait for the core.json file to be created with a timeout
        const maxWaitTime = 10000; // 10 seconds
        const startTime = Date.now();
        while (!fs_1.default.existsSync(coreJsonPath) && (Date.now() - startTime) < maxWaitTime) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (!fs_1.default.existsSync(coreJsonPath)) {
            console.error(`Pitono core.json not found at: ${coreJsonPath} after waiting ${maxWaitTime}ms`);
            return;
        }
        try {
            const coreData = JSON.parse(fs_1.default.readFileSync(coreJsonPath, 'utf-8'));
            const entryPoints = coreData.entryPoints;
            for (const entryPoint of entryPoints) {
                try {
                    console.log(`Running pitono test: ${entryPoint}`);
                    // Use python to execute the test file
                    const absolutePath = path_1.default.resolve(entryPoint);
                    // Check if the file exists
                    if (!fs_1.default.existsSync(absolutePath)) {
                        console.error(`Pitono test file not found: ${absolutePath}`);
                        continue;
                    }
                    (0, child_process_1.execSync)(`python "${absolutePath}"`, { stdio: 'inherit' });
                    console.log(`Pitono test completed: ${entryPoint}`);
                }
                catch (error) {
                    console.error(`Pitono test failed: ${entryPoint}`, error);
                    throw error;
                }
            }
        }
        catch (error) {
            console.error(`Error reading or parsing core.json: ${error}`);
        }
    }
}
exports.PitonoRunner = PitonoRunner;
