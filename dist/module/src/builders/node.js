console.log("Node build process started");
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
async function runNodeBuild() {
    try {
        // Install dependencies
        console.log("Installing Node.js dependencies...");
        const installResult = await execAsync('npm install');
        if (installResult.stdout)
            console.log(installResult.stdout);
        // Run tests
        console.log("Running Node.js tests...");
        const testResult = await execAsync('npm test');
        if (testResult.stdout)
            console.log(testResult.stdout);
        if (testResult.stderr)
            console.error(testResult.stderr);
        // Build the project
        console.log("Building Node.js project...");
        const buildResult = await execAsync('npm run build');
        if (buildResult.stdout)
            console.log(buildResult.stdout);
        if (buildResult.stderr)
            console.error(buildResult.stderr);
        console.log("Node.js build completed successfully");
    }
    catch (error) {
        console.error("Node.js build failed:", error);
        process.exit(1);
    }
}
runNodeBuild();
