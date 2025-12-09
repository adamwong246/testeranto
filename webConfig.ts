import { sassPlugin } from "esbuild-sass-plugin";
import { IChecks } from "./src/Types";
import { WEB_BASE_STEPS, WEB_METAFILE_ANALYSIS } from "./allTestsUtils";

export const WEB_BUILD_STEPS: [IDockerSteps, string][] = [
  ...WEB_BASE_STEPS,
  ...WEB_METAFILE_ANALYSIS.slice(WEB_BASE_STEPS.length),
  ["RUN", "npm run build"],
];

export const WEB_STATIC_ANALYSIS: IChecks = {
  eslint: [
    [
      ["WORKDIR", "/workspace"],
      [
        "RUN",
        "npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin",
      ],
    ],
    "npx eslint src/ --ext .ts,.tsx --max-warnings=0",
  ],
  typescript: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev typescript"],
    ],
    "npx tsc --noEmit",
  ],
  stylelint: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev stylelint"],
    ],
    "npx stylelint 'src/**/*.css' 'src/**/*.scss'",
  ],
  prettier: [
    [
      ["WORKDIR", "/workspace"],
      ["RUN", "npm install --save-dev prettier"],
    ],
    "npx prettier --check src/",
  ],
};

export const webConfig = {
  flavor: ["chrome", "node:20.19.4-alpine-chrome"] as ["compiled" | "interpreted" | "VM" | "chrome", string],
  testFile: "example/Calculator.test.ts",
  options: {
    plugins: [() => sassPlugin()],
    loaders: { ".ttf": "file" },
    chrome: {
      sharedInstance: true,
      maxContexts: 4,
      memoryLimitMB: 256,
    },
    checks: WEB_STATIC_ANALYSIS,
    build: [WEB_BUILD_STEPS],
  }
};
