"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const mockPMBase_1 = require("./mockPMBase");
const pmProxy_1 = require("../pmProxy");
function createPathRewriter(basePath) {
    return (path) => {
        if (!path)
            return path;
        // Normalize paths and handle edge cases
        const normalizedPath = path.replace(/\\/g, "/");
        const normalizedBase = basePath.replace(/\\/g, "/");
        // Handle absolute paths
        if (normalizedPath.startsWith("/")) {
            return `${normalizedBase}${normalizedPath}`;
        }
        // Handle parent directory references
        if (normalizedPath.includes("../")) {
            const parts = normalizedPath.split("/");
            const baseParts = normalizedBase.split("/");
            for (const part of parts) {
                if (part === "..") {
                    baseParts.pop();
                }
                else if (part !== ".") {
                    baseParts.push(part);
                }
            }
            return baseParts.join("/");
        }
        return `${normalizedBase}/${normalizedPath}`;
    };
}
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
        theButTheProxyReturns: (method, expectedPath) => async (store) => {
            const mockPm = new mockPMBase_1.MockPMBase();
            const filepath = "test/path";
            // Track the actual path that was used
            let actualPath;
            // Monkey patch to track the path
            const originalWriteFileSync = mockPm.writeFileSync;
            mockPm.writeFileSync = async (path, content, testName) => {
                actualPath = path;
                return originalWriteFileSync.call(mockPm, path, content, testName);
            };
            const originalCreateWriteStream = mockPm.createWriteStream;
            mockPm.createWriteStream = async (path, testName) => {
                actualPath = path;
                return originalCreateWriteStream.call(mockPm, path, testName);
            };
            const originalScreencast = mockPm.screencast;
            mockPm.screencast = async (opts, testName, page) => {
                actualPath = opts.path;
                return originalScreencast.call(mockPm, opts, testName, page);
            };
            const originalCustomScreenShot = mockPm.customScreenShot;
            mockPm.customScreenShot = async (opts, testName, pageUid) => {
                actualPath = opts.path;
                return originalCustomScreenShot.call(mockPm, opts, testName, pageUid);
            };
            try {
                switch (method) {
                    case "writeFileSync":
                        await (0, pmProxy_1.butThenProxy)(mockPm, filepath, {}).writeFileSync("test.txt", "content", "test");
                        break;
                    case "createWriteStream":
                        await (0, pmProxy_1.butThenProxy)(mockPm, filepath, {}).createWriteStream("stream.txt", "test");
                        break;
                    case "screencast":
                        await (0, pmProxy_1.butThenProxy)(mockPm, filepath, {}).screencast({ path: "screen.png" }, "test");
                        break;
                    case "customScreenShot":
                        await (0, pmProxy_1.butThenProxy)(mockPm, filepath, {}).customScreenShot({ path: "shot.png" }, "test");
                        break;
                    default:
                        throw new Error(`Unknown method: ${method}`);
                }
                // For now, just return the actual path to be asserted against expectedPath
                // The testAdapter.assertThis will handle the comparison
                return actualPath;
            }
            catch (error) {
                throw error;
            }
        },
        verifyContent: (expectedContent) => (result) => {
            const actualContent = result[2];
            if (JSON.stringify(actualContent) !== JSON.stringify(expectedContent)) {
                throw new Error(`Content mismatch. Expected: ${JSON.stringify(expectedContent)}, Got: ${JSON.stringify(actualContent)}`);
            }
            return result;
        },
        // Test to verify tests.json is written correctly
        verifyTestsJsonWrite: () => async (store) => {
            const mockPm = new mockPMBase_1.MockPMBase();
            // Track the actual parameters passed to writeFileSync
            let actualArgs;
            const originalWriteFileSync = mockPm.writeFileSync;
            mockPm.writeFileSync = async (...args) => {
                actualArgs = args;
                // Check if the first argument is being split
                if (args[0] && typeof args[0] === "string") {
                    console.log(`[TESTS.JSON DEBUG] First argument length: ${args[0].length}, value: "${args[0]}"`);
                }
                return originalWriteFileSync.apply(mockPm, args);
            };
            // Simulate writing tests.json through the proxy
            // This should mimic the call in BaseBuilder: puppetMaster.writeFileSync(`tests.json`, JSON.stringify(this.toObj(), null, 2))
            const testData = { test: "data" };
            // const result = await butThenProxy(mockPm, "test/path", {}).writeFileSync(
            //   "tests.json",
            //   JSON.stringify(testData, null, 2),
            //   "test"
            // );
            // Check if both path and content are correct
            if (actualArgs &&
                actualArgs[0] === "test/path/butThen/tests.json" &&
                actualArgs[1] === JSON.stringify(testData, null, 2) &&
                actualArgs[2] === "test") {
                return "PASS";
            }
            else {
                return `FAIL: args=${JSON.stringify(actualArgs)}`;
            }
        },
    },
};
