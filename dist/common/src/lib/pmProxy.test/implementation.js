"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const mockPMBase_1 = require("./mockPMBase");
exports.implementation = {
    suites: {
        Default: "PM Proxy Tests",
    },
    givens: {
        SomeBaseString: (s) => s,
    },
    whens: {
    // functions have no mutations
    },
    thens: {
        theButTheProxyReturns: (method, expectedPath) => (store) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const mockPm = new mockPMBase_1.MockPMBase();
            const filepath = "test/path";
            const proxiedPm = store.butThenProxy(mockPm, filepath);
            let actualPath;
            let actualContent;
            try {
                switch (method) {
                    case "writeFileSync":
                        const content = expectedPath.includes('content') ?
                            "test content" : "default content";
                        proxiedPm.writeFileSync(expectedPath.includes('empty') ? "" :
                            expectedPath.includes('nested') ? "nested/folder/test.txt" :
                                expectedPath.includes('spaces') ? "file with spaces.txt" :
                                    expectedPath.includes('invalid') ? "../invalid.txt" :
                                        "test.txt", content);
                        actualPath = (_a = mockPm.getLastCall("writeFileSync")) === null || _a === void 0 ? void 0 : _a.path;
                        actualContent = (_b = mockPm.getLastCall("writeFileSync")) === null || _b === void 0 ? void 0 : _b.content;
                        break;
                    case "createWriteStream":
                        proxiedPm.createWriteStream(expectedPath.includes('empty') ? "" : "stream.txt");
                        actualPath = (_c = mockPm.getLastCall("createWriteStream")) === null || _c === void 0 ? void 0 : _c.path;
                        break;
                    case "screencast":
                        proxiedPm.screencast({
                            path: "screen.png",
                            quality: 80,
                            fullPage: true
                        }, "test");
                        actualPath = (_e = (_d = mockPm.getLastCall("screencast")) === null || _d === void 0 ? void 0 : _d.opts) === null || _e === void 0 ? void 0 : _e.path;
                        actualContent = (_f = mockPm.getLastCall("screencast")) === null || _f === void 0 ? void 0 : _f.opts;
                        break;
                    case "customScreenShot":
                        proxiedPm.customScreenShot({ path: "shot.png" }, "test");
                        actualPath = (_h = (_g = mockPm.getLastCall("customScreenShot")) === null || _g === void 0 ? void 0 : _g.opts) === null || _h === void 0 ? void 0 : _h.path;
                        break;
                    default:
                        throw new Error(`Unknown method: ${method}`);
                }
                if (expectedPath === undefined) {
                    return [undefined, undefined];
                }
                return [actualPath, expectedPath, actualContent];
            }
            catch (error) {
                return [error.message, expectedPath];
            }
        },
        verifyContent: (expectedContent) => (result) => {
            const actualContent = result[2];
            if (JSON.stringify(actualContent) !== JSON.stringify(expectedContent)) {
                throw new Error(`Content mismatch. Expected: ${JSON.stringify(expectedContent)}, Got: ${JSON.stringify(actualContent)}`);
            }
            return result;
        },
    },
    checks: {
        Default: (s) => s,
    },
};
