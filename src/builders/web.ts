console.log("Web build process started");

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runWebBuild() {
    try {
        // Install dependencies
        console.log("Installing web dependencies...");
        const installResult = await execAsync('npm install');
        if (installResult.stdout) console.log(installResult.stdout);
        
        // Run linting
        console.log("Running linting...");
        const lintResult = await execAsync('npm run lint');
        if (lintResult.stdout) console.log(lintResult.stdout);
        if (lintResult.stderr) console.error(lintResult.stderr);
        
        // Build the web assets
        console.log("Building web assets...");
        const buildResult = await execAsync('npm run build');
        if (buildResult.stdout) console.log(buildResult.stdout);
        if (buildResult.stderr) console.error(buildResult.stderr);
        
        console.log("Web build completed successfully");
    } catch (error) {
        console.error("Web build failed:", error);
        process.exit(1);
    }
}

runWebBuild();
