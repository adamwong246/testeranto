import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/esbuildConfigs/eslint-formatter-testeranto.ts
function eslint_formatter_testeranto_default(results) {
  return JSON.stringify(results, null, 2);
}
export {
  eslint_formatter_testeranto_default as default
};
