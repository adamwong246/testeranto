"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePitonoMetafile = generatePitonoMetafile;
exports.writePitonoMetafile = writePitonoMetafile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
async function generatePitonoMetafile(testName, entryPoints) {
    return {
        testName,
        entryPoints,
        timestamp: Date.now()
    };
}
function writePitonoMetafile(testName, metafile) {
    const metafilePath = path_1.default.join(process.cwd(), 'testeranto', 'pitono', testName, 'metafile.json');
    const metafileDir = path_1.default.dirname(metafilePath);
    // Ensure directory exists
    if (!fs_1.default.existsSync(metafileDir)) {
        fs_1.default.mkdirSync(metafileDir, { recursive: true });
    }
    // Write the metafile
    fs_1.default.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log(`Pitono metafile written to: ${metafilePath}`);
    // Generate core.json using the Python script
    try {
        // First try using the installed command
        const command = `pitono-core-generator ${testName} ${metafile.entryPoints.join(' ')}`;
        (0, child_process_1.execSync)(command, { stdio: 'inherit' });
        console.log(`Pitono core.json generated successfully for ${testName}`);
    }
    catch (error) {
        console.error(`Failed to generate Pitono core.json with installed command: ${error}`);
        // Fallback to direct Python execution
        try {
            const pythonCommand = `python ${process.cwd()}/pitono/core_generator.py ${testName} ${metafile.entryPoints.join(' ')}`;
            (0, child_process_1.execSync)(pythonCommand, { stdio: 'inherit' });
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
                const coreFilePath = path_1.default.join(process.cwd(), 'testeranto', 'pitono', testName, 'core.json');
                fs_1.default.writeFileSync(coreFilePath, JSON.stringify(coreData, null, 2));
                console.log(`Pitono core.json created manually as fallback`);
            }
            catch (manualError) {
                console.error(`Even manual creation failed: ${manualError}`);
            }
        }
    }
}
