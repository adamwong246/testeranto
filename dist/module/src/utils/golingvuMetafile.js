/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateGolingvuMetafile as gmf } from "./generateGolingvuMetafile";
import fs from "fs";
import path from "path";
export const generateGolingvuMetafile = gmf;
export const writeGolingvuMetafile = (testName, metafile) => {
    console.log("DEBUG: writeGolingvuMetafile called with testName:", testName);
    // Use just the basename without extension for the metafile
    const basename = path.basename(testName, path.extname(testName));
    console.log("DEBUG: Using basename:", basename);
    const metafileDir = path.join(process.cwd(), `testeranto/metafiles/golang`);
    const metafilePath = path.join(metafileDir, `${basename}.json`);
    console.log("DEBUG: Metafile path:", metafilePath);
    // Ensure the directory exists
    if (!fs.existsSync(metafileDir)) {
        console.log("DEBUG: Creating metafile directory:", metafileDir);
        fs.mkdirSync(metafileDir, { recursive: true });
    }
    console.log("DEBUG: Writing metafile to:", metafilePath);
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log("DEBUG: Metafile written successfully");
};
