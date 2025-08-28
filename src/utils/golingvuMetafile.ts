import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export interface GolingvuBuildResult {
  errors: any[];
  warnings: any[];
  metafile?: {
    inputs: Record<string, {
      bytes: number;
      imports: any[];
    }>;
    outputs: Record<
      string,
      {
        bytes: number;
        inputs: Record<string, { bytesInOutput: number }>;
        entryPoint: string;
      }
    >;
  };
}

export async function generateGolangMetafile(testName: string, entryPoints: string[]): Promise<GolingvuBuildResult> {
  const outputs: Record<
    string,
    {
      entryPoint: string;
      inputs: Record<string, { bytesInOutput: number }>;
      bytes: number;
    }
  > = {};

  // Process each Go entry point
  for (const entryPoint of entryPoints) {
    try {
      // Get the package directory to find all Go files in the same package
      const entryDir = path.dirname(entryPoint);
      
      // Find all .go files in the same directory
      const goFiles = fs.readdirSync(entryDir)
        .filter(file => file.endsWith('.go'))
        .map(file => path.join(entryDir, file));
      
      // Create inputs record
      const inputs: Record<string, { bytesInOutput: number }> = {};
      let totalBytes = 0;
      
      for (const file of goFiles) {
        try {
          const stats = fs.statSync(file);
          inputs[file] = { bytesInOutput: stats.size };
          totalBytes += stats.size;
        } catch {
          inputs[file] = { bytesInOutput: 0 };
        }
      }
      
      // Add the entry point itself if not already included
      if (!inputs[entryPoint]) {
        try {
          const entryStats = fs.statSync(entryPoint);
          inputs[entryPoint] = { bytesInOutput: entryStats.size };
          totalBytes += entryStats.size;
        } catch {
          inputs[entryPoint] = { bytesInOutput: 0 };
        }
      }

      // The output path should match the Node.js structure - use a path in testeranto/bundles
      // For Go, we don't have actual bundled outputs, so we'll use a placeholder
      const outputPath = `testeranto/bundles/golang/${testName}/${entryPoint}`;
      outputs[outputPath] = {
        entryPoint: entryPoint, // Use the source file path, not the bundle path
        inputs,
        bytes: totalBytes
      };
    } catch (error) {
      console.error(`Error processing Go entry point ${entryPoint}:`, error);
    }
  }

  // Create inputs record for the metafile - include all Go files
  const allInputs: Record<string, {
    bytes: number;
    imports: any[];
  }> = {};
  
  // Collect all unique Go files from all entry points
  const allGoFiles = new Set<string>();
  
  for (const entryPoint of entryPoints) {
    try {
      const entryDir = path.dirname(entryPoint);
      
      // Find all .go files in the same directory
      const goFiles = fs.readdirSync(entryDir)
        .filter(file => file.endsWith('.go'))
        .map(file => path.join(entryDir, file));
      
      goFiles.forEach(file => allGoFiles.add(file));
      
      // Add the entry point itself
      allGoFiles.add(entryPoint);
    } catch (error) {
      console.error(`Error processing Go entry point ${entryPoint} for source files:`, error);
    }
  }

  // Add all Go files to inputs
  for (const filePath of Array.from(allGoFiles)) {
    try {
      const stats = fs.statSync(filePath);
      allInputs[filePath] = { 
        bytes: stats.size,
        imports: [] // Go files don't have imports like JS
      };
    } catch {
      allInputs[filePath] = { 
        bytes: 0,
        imports: []
      };
    }
  }
  
  // Reformat outputs to match esbuild structure
  const esbuildOutputs: Record<string, {
    bytes: number;
    inputs: Record<string, { bytesInOutput: number }>;
    entryPoint: string;
  }> = {};
  for (const [outputPath, output] of Object.entries(outputs)) {
    esbuildOutputs[outputPath] = {
      bytes: output.bytes,
      inputs: output.inputs,
      entryPoint: output.entryPoint
    };
  }
  
  return {
    errors: [],
    warnings: [],
    metafile: {
      inputs: allInputs,
      outputs: esbuildOutputs
    }
  };
}


export function writeGolangMetafile(
  testName: string,
  metafile: GolingvuBuildResult
): void {
  const metafileDir = path.join(
    process.cwd(),
    "testeranto",
    "metafiles",
    "golang"
  );
  fs.mkdirSync(metafileDir, { recursive: true });

  const metafilePath = path.join(metafileDir, `${testName}.json`);
  fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
}
