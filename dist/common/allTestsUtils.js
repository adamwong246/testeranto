"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLangConfig = void 0;
const createLangConfig = (testFile, checks, dockerfile, options) => {
    return {
        plugins: (options === null || options === void 0 ? void 0 : options.plugins) || [],
        loaders: (options === null || options === void 0 ? void 0 : options.loaders) || {},
        tests: { [testFile]: { ports: 0 } },
        externals: (options === null || options === void 0 ? void 0 : options.externals) || [],
        test: options === null || options === void 0 ? void 0 : options.testBlocks,
        prod: options === null || options === void 0 ? void 0 : options.prodBlocks,
        checks,
        volumes: options === null || options === void 0 ? void 0 : options.volumes,
        dockerfile,
    };
};
exports.createLangConfig = createLangConfig;
