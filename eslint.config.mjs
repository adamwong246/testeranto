// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc'
import { configs as importconfigs, flatConfigs } from "eslint-plugin-import";
// import importPlugin from 'eslint-plugin-import';

const cycleDetector = flatConfigs.recommended;
cycleDetector.rules['import/no-cycle'] = "error";
// cycleDetector.extends = ["plugin:import/typescript"];

const eslintConfig = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // flatConfigs.recommended,
  // {
  //   files: ['**/*.{,js,mjs,cjs,ts,tsx,mts}'],
  //   languageOptions: {
  //     ecmaVersion: 'latest',
  //     sourceType: 'module',
  //   },
  //   rules: {
  //     'no-unused-vars': 'off',
  //     'import/no-dynamic-require': 'warn',
  //     'import/no-nodejs-modules': 'warn',
  //   },
  //   // "extends": [
  //   //   "eslint:recommended",
  //   //   "plugin:import/recommended",
  //   //   // the following lines do the trick
  //   //   "plugin:import/typescript",
  //   // ],
  //   // "extends": {
  //   //   eslint: "eslint:recommended",
  //   //   importRecommended: "plugin:import/recommended",
  //   //   // the following lines do the trick
  //   //   importTypescript: "plugin:import/typescript",
  //   // },
  //   "settings": {
  //     "import/resolver": {
  //       // You will also need to install and configure the TypeScript resolver
  //       // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
  //       "typescript": true,
  //       "node": true,
  //     },
  //   },
  // },

  // {
  //   "extends": [
  //     "eslint:recommended",
  //     "plugin:import/recommended",
  //     // the following lines do the trick
  //     "plugin:import/typescript",
  //   ],
  //   "settings": {
  //     "import/resolver": {
  //       // You will also need to install and configure the TypeScript resolver
  //       // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
  //       "typescript": true,
  //       "node": true,
  //     },
  //   },
  // }

  // {
  //   files: ['*.ts', '*.tsx'],
  //   plugins: {
  //     'import': cycleDetector
  //   },
  //   settings: {
  //     'import/resolver': {
  //       typescript: {},
  //       node: {
  //         extensions: ['.js', '.jsx', '.ts', '.tsx'],
  //       },
  //     },
  //     'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  //   },
  //   rules: {
  //     // Add or override rules as needed
  //   },
  // }
  // cycleDetector
  // configs
  // {
  //   // ...configs,
  //   "plugins": { "import": {} },
  //   "rules": {
  //     "import/no-cycle": "error" // or "warn"
  //   },
  //   // extends: flatConfigs
  //   // "extends": [
  //   //   "plugin:import/typescript"
  //   // ],
  // }
)

// eslintConfig.push({
//   "plugins": { "import": {} },
//   "rules": {
//     "import/no-cycle": "error" // or "warn"
//   },
// })
// eslintConfig.plugins['import/typescript'] = importconfigs
// console.log("HELLO TSLINT eslintConfig", eslintConfig)
// console.log("HELLO TSLINT importconfigs", importconfigs)
// console.log("HELLO TSLINT flatConfigs", flatConfigs)

export default eslintConfig;