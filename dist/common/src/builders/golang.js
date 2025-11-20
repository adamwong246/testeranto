"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Golang build process started");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function runGolangBuild() {
    try {
        // Build Go code
        console.log("Building Go code...");
        const { stdout, stderr } = await execAsync('go build -o /tmp/golang-build ./example/Calculator.go');
        if (stdout)
            console.log(stdout);
        if (stderr)
            console.error(stderr);
        // Run tests if they exist
        console.log("Running Go tests...");
        const testResult = await execAsync('go test ./...');
        if (testResult.stdout)
            console.log(testResult.stdout);
        if (testResult.stderr)
            console.error(testResult.stderr);
        console.log("Golang build completed successfully");
    }
    catch (error) {
        console.error("Golang build failed:", error);
        process.exit(1);
    }
}
runGolangBuild();
