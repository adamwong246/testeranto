import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
export async function generatePitonoMetafile(testName, entryPoints) {
    return {
        testName,
        entryPoints,
        timestamp: Date.now()
    };
}
export function writePitonoMetafile(testName, metafile) {
    const metafilePath = path.join(process.cwd(), 'testeranto', 'pitono', testName, 'metafile.json');
    const metafileDir = path.dirname(metafilePath);
    // Ensure directory exists
    if (!fs.existsSync(metafileDir)) {
        fs.mkdirSync(metafileDir, { recursive: true });
    }
    // Write the metafile
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log(`Pitono metafile written to: ${metafilePath}`);
    // Generate core.json using the Python script
    try {
        // First try using the installed command
        const command = `pitono-core-generator ${testName} ${metafile.entryPoints.join(' ')}`;
        execSync(command, { stdio: 'inherit' });
        console.log(`Pitono core.json generated successfully for ${testName}`);
    }
    catch (error) {
        console.error(`Failed to generate Pitono core.json with installed command: ${error}`);
        // Fallback to direct Python execution
        try {
            const pythonCommand = `python ${process.cwd()}/pitono/core_generator.py ${testName} ${metafile.entryPoints.join(' ')}`;
            execSync(pythonCommand, { stdio: 'inherit' });
            console.log(`Pitono core.json generated successfully using direct Python execution`);
        }
        catch (fallbackError) {
            console.error(`Direct Python execution also failed: ${fallbackError}`);
            // Last resort: create the core.json manually
            try {
                const coreData = {
                    testName: testName,
                    entryPoints: metafile.entryPoints,
                    outputs: {},
                    metafile: {
                        inputs: {},
                        outputs: {}
                    },
                    timestamp: Date.now(),
                    runtime: "pitono"
                };
                const coreFilePath = path.join(process.cwd(), 'testeranto', 'pitono', testName, 'core.json');
                fs.writeFileSync(coreFilePath, JSON.stringify(coreData, null, 2));
                console.log(`Pitono core.json created manually as fallback`);
            }
            catch (manualError) {
                console.error(`Even manual creation failed: ${manualError}`);
            }
        }
    }
}
