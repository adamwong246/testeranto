import { ESLint } from "eslint";

const eslint = new ESLint();
const formatter = await eslint.loadFormatter(
  "./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs"
);

export const lintCheck = async (addableFiles) => {
  const results = (await eslint.lintFiles(addableFiles))
    .filter((r) => r.messages.length)
    .filter((r) => {
      return r.messages[0].ruleId !== null;
    })
    .map((r) => {
      delete r.source;
      return r;
    });

  return await formatter.format(results);
};
