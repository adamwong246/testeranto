import esbuild from "esbuild";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { WebSocket } from "ws";
import { IBuiltConfig } from "../../Types";

export interface BuildOptions {
  config: IBuiltConfig;
  entryPoints: string[];
  configPath: string;
  bundlesDir: string;
  metafileSubdir: string;
}

// Helper to compute a simple hash from file paths and contents
export async function computeFilesHash(files: string[]): Promise<string> {
  const hash = crypto.createHash('md5');

  for (const file of files) {
    try {
      const stats = fs.statSync(file);
      hash.update(file);
      hash.update(stats.mtimeMs.toString());
      hash.update(stats.size.toString());
    } catch (error) {
      // File may not exist, include its name anyway
      hash.update(file);
      hash.update('missing');
    }
  }

  return hash.digest('hex');
}

// Connect to WebSocket server and send sourceFilesUpdated message
export async function sendSourceFilesUpdated(
  config: IBuiltConfig,
  hash: string,
  files: string[],
  testName: string,
  runtime: 'node' | 'web'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const wsUrl = `ws://host.docker.internal:${config.httpPort}/ws`;
    console.log(`[${runtime} Builder] Connecting to WebSocket at ${wsUrl}`);

    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log(`[${runtime} Builder] WebSocket connected, sending sourceFilesUpdated for ${testName}`);
      ws.send(JSON.stringify({
        type: 'sourceFilesUpdated',
        data: {
          testName,
          hash,
          files,
          runtime
        }
      }));

      // Wait a moment for the message to be sent before closing
      setTimeout(() => {
        ws.close();
        resolve();
      }, 1000);
    });

    ws.on('error', (error) => {
      console.error(`[${runtime} Builder] WebSocket error:`, error);
      reject(error);
    });

    ws.on('close', () => {
      console.log(`[${runtime} Builder] WebSocket connection closed`);
    });
  });
}

// Extract input files from metafile
export function extractInputFilesFromMetafile(metafile: any): string[] {
  const files: string[] = [];

  if (metafile && metafile.inputs) {
    for (const inputPath of Object.keys(metafile.inputs)) {
      // Convert to absolute path if needed
      files.push(path.resolve(process.cwd(), inputPath));
    }
  }

  return files;
}

export async function processMetafile(
  config: IBuiltConfig,
  metafile: any,
  runtime: 'node' | 'web'
): Promise<void> {
  if (!metafile || !metafile.outputs) {
    return;
  }

  for (const [outputFile, outputInfo] of Object.entries(metafile.outputs)) {
    const outputInfoTyped = outputInfo as any;

    // Only process outputs that have an associated entryPoint
    if (!outputInfoTyped.entryPoint) {
      console.log(`[${runtime} Builder] Skipping output without entryPoint: ${outputFile}`);
      continue;
    }

    // Get the entry point path
    const entryPoint = outputInfoTyped.entryPoint;

    // Only process test files (files ending with .test.ts, .test.js, .spec.ts, .spec.js)
    // Also, exclude library files like src/lib/tiposkripto/Web.ts and src/lib/tiposkripto/Node.ts
    const isTestFile = /\.(test|spec)\.(ts|js)$/.test(entryPoint);
    if (!isTestFile) {
      console.log(`[${runtime} Builder] Skipping non-test entryPoint: ${entryPoint}`);
      continue;
    }

    // Get input files for this output and convert to absolute paths
    const inputFiles = Object.keys(outputInfoTyped.inputs || {}).map(file =>
      path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
    );
    fs.writeFileSync(`testeranto/bundles/allTests/${runtime}/${entryPoint.split('.').slice(0, -1).concat('mjs').join('.')}-inputFiles.json`, JSON.stringify(inputFiles, null, 2));

    console.log("markl!")

  }

}
