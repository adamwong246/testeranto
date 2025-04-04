import { watch } from "fs";
import path from "path";
import crypto from "node:crypto";
import fs from "fs";
import tsc from "tsc-prog";
import { ESLint } from "eslint";
import ts from "typescript";

import { PM_Main } from "./PM/main";
import { IBaseConfig, IBuiltConfig, ITestTypes } from "./lib/types";

type IRunnables = {
  nodeEntryPoints: Record<string, string>;
  webEntryPoints: Record<string, string>;
};

const fileHashes = {};

async function fileHash(filePath, algorithm = "md5") {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("data", (data) => {
      hash.update(data);
    });

    fileStream.on("end", () => {
      const fileHash = hash.digest("hex");
      resolve(fileHash);
    });

    fileStream.on("error", (error) => {
      reject(`Error reading file: ${error.message}`);
    });
  });
}

const getRunnables = (
  tests: ITestTypes[],
  payload = {
    nodeEntryPoints: {},
    webEntryPoints: {},
  }
): IRunnables => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path.resolve(
        `./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path.resolve(
        `./docs/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    }

    if (cv[3].length) {
      getRunnables(cv[3], payload);
    }

    return pt;
  }, payload as IRunnables);
};

const tscPather = (entryPoint: string, platform: "web" | "node") => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `type_errors.txt`
  );
};

const tscExitCodePather = (entryPoint: string, platform: "web" | "node") => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `type_errors.exitcode`
  );
};

const lintPather = (entryPoint: string, platform: "web" | "node") => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `lint_errors.json`
  );
};

const lintExitCodePather = (entryPoint: string, platform: "web" | "node") => {
  return path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `lint_errors.exitcode`
  );
};

const tscCheck = ({
  entrypoint,
  addableFiles,
  platform,
}: {
  platform: "web" | "node";
  entrypoint: string;
  addableFiles: string[];
}) => {
  console.log("tsc <", entrypoint);

  const program = tsc.createProgramFromConfig({
    basePath: process.cwd(), // always required, used for relative paths
    configFilePath: "tsconfig.json", // config to inherit from (optional)
    compilerOptions: {
      rootDir: "src",
      outDir: tscPather(entrypoint, platform),
      // declaration: true,
      // skipLibCheck: true,
      noEmit: true,
    },
    include: addableFiles, //["src/**/*"],
    // exclude: ["**/*.test.ts", "**/*.spec.ts"],
  });
  const tscPath = tscPather(entrypoint, platform);

  let allDiagnostics = program.getSemanticDiagnostics();

  const d: string[] = [];
  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      d.push(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      d.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  });

  fs.writeFileSync(tscPath, d.join("\n"));
  fs.writeFileSync(
    tscExitCodePather(entrypoint, platform),
    d.length.toString()
  );
};

const eslint = new ESLint();
const formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/eslint-formatter-testeranto.mjs"
);

const eslintCheck = async (
  entrypoint: string,
  platform: "web" | "node",
  addableFiles: string[]
) => {
  console.log("eslint <", entrypoint);
  const results = (await eslint.lintFiles(addableFiles))
    .filter((r) => r.messages.length)
    .filter((r) => {
      return r.messages[0].ruleId !== null;
    })
    .map((r) => {
      delete r.source;
      return r;
    });

  fs.writeFileSync(
    lintPather(entrypoint, platform),
    await formatter.format(results)
  );
  fs.writeFileSync(
    lintExitCodePather(entrypoint, platform),
    results.length.toString()
  );
};

const makePrompt = (
  entryPoint: string,
  addableFiles: string[],
  platform: "web" | "node"
) => {
  const promptPath = path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `prompt.txt`
  );

  const testPaths = path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `tests.json`
  );

  const featuresPath = path.join(
    "./docs/",
    platform,
    entryPoint.split(".").slice(0, -1).join("."),
    `featurePrompt.txt`
  );

  fs.writeFileSync(
    promptPath,
    `
${addableFiles
  .map((x) => {
    return `/add ${x}`;
  })
  .join("\n")}

/read ${lintPather(entryPoint, platform)}
/read ${tscPather(entryPoint, platform)}
/read ${testPaths}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files ${tscPather(
      entryPoint,
      platform
    )}. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${lintPather(
      entryPoint,
      platform
    )}"
          `
  );
};

type IOutputs = Record<
  string,
  {
    entryPoint: string;
    inputs: Record<string, string>;
  }
>;

const metafileOutputs = async (platform: "web" | "node") => {
  const outputs: IOutputs = JSON.parse(
    fs.readFileSync(`docs/${platform}/metafile.json`).toString()
  ).metafile.outputs;

  Object.keys(outputs).forEach((k) => {
    const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
      if (!fs.existsSync(i)) return false;
      if (i.startsWith("node_modules")) return false;
      return true;
    });

    const f = `${k.split(".").slice(0, -1).join(".")}/`;
    if (!fs.existsSync(f)) {
      fs.mkdirSync(f);
    }

    const entrypoint = outputs[k].entryPoint;

    if (entrypoint) {
      tscCheck({ platform, addableFiles, entrypoint });
      eslintCheck(entrypoint, platform, addableFiles);
      makePrompt(entrypoint, addableFiles, platform);
    }
  });
};

import(process.cwd() + "/" + process.argv[2]).then(async (module) => {
  const rawConfig: IBaseConfig = module.default;

  const config: IBuiltConfig = {
    ...rawConfig,
    buildDir: process.cwd() + "/" + rawConfig.outdir,
  };

  metafileOutputs("node");
  watch("docs/node/metafile.json", async (e, filename) => {
    console.log(`< ${e} ${filename}`);
    metafileOutputs("node");
  });

  metafileOutputs("web");
  watch("docs/web/metafile.json", async (e, filename) => {
    console.log(`< ${e} ${filename}`);
    metafileOutputs("web");
  });

  let pm: PM_Main | undefined = new PM_Main(config);

  await pm.startPuppeteer(
    {
      slowMo: 1,
      // timeout: 1,
      waitForInitialPage: false,
      executablePath:
        // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
        "/opt/homebrew/bin/chromium",
      headless: true,
      dumpio: true,
      // timeout: 0,
      devtools: true,

      args: [
        "--auto-open-devtools-for-tabs",
        `--remote-debugging-port=3234`,

        // "--disable-features=IsolateOrigins,site-per-process",
        "--disable-site-isolation-trials",
        "--allow-insecure-localhost",
        "--allow-file-access-from-files",
        "--allow-running-insecure-content",

        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--disable-site-isolation-trials",
        "--disable-web-security",
        "--no-first-run",
        "--no-sandbox",
        "--no-startup-window",
        // "--no-zygote",
        "--reduce-security-for-testing",
        "--remote-allow-origins=*",
        "--unsafely-treat-insecure-origin-as-secure=*",
        // "--disable-features=IsolateOrigins",
        // "--remote-allow-origins=ws://localhost:3234",
        // "--single-process",
        // "--unsafely-treat-insecure-origin-as-secure",
        // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",

        // "--disk-cache-dir=/dev/null",
        // "--disk-cache-size=1",
        // "--start-maximized",
      ],
    },
    "."
  );

  const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);

  Object.entries(nodeEntryPoints).forEach(
    ([k, outputFile]: [string, string]) => {
      console.log("watching and running", outputFile);
      pm.launchNode(k, outputFile);
      try {
        watch(outputFile, async (e, filename) => {
          const hash = await fileHash(outputFile);
          if (fileHashes[k] !== hash) {
            fileHashes[k] = hash;
            console.log(`< ${e} ${filename}`);
            pm.launchNode(k, outputFile);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  );

  Object.entries(webEntryPoints).forEach(
    ([k, outputFile]: [string, string]) => {
      console.log("watching and running", outputFile);
      pm.launchWeb(k, outputFile);
      watch(outputFile, async (e, filename) => {
        const hash = await fileHash(outputFile);
        console.log(`< ${e} ${filename}`);
        if (fileHashes[k] !== hash) {
          fileHashes[k] = hash;
          pm.launchWeb(k, outputFile);
        }
      });
    }
  );
});
