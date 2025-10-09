"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Python build process started");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function runPythonBuild() {
    try {
        // Run Python syntax check using local environment
        console.log("Checking Python syntax...");
        const syntaxCheck = await execAsync('python3 -m py_compile ./example/Calculator.py');
        if (syntaxCheck.stdout)
            console.log(syntaxCheck.stdout);
        // Run Python tests if they exist using local environment
        console.log("Running Python tests...");
        const testResult = await execAsync('python3 -m pytest ./example/ -v');
        if (testResult.stdout)
            console.log(testResult.stdout);
        if (testResult.stderr)
            console.error(testResult.stderr);
        console.log("Python build completed successfully");
    }
    catch (error) {
        console.error("Python build failed:", error);
        process.exit(1);
    }
}
runPythonBuild();
