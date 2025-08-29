"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summaryDotJson = exports.fetchTestData = exports.fetchProjectData = void 0;
const logFiles_1 = require("./logFiles");
const fetchProjectData = async (projectName) => {
    const [summaryRes, configRes] = await Promise.all([
        fetch((0, exports.summaryDotJson)(projectName)),
        fetch("/reports/config.json"),
    ]);
    return {
        summary: (await summaryRes.json()),
        config: (await configRes.json()),
    };
};
exports.fetchProjectData = fetchProjectData;
const fetchTestData = async (projectName, filepath, runTime) => {
    const basePath = `reports/${projectName}/${filepath
        .split(".")
        .slice(0, -1)
        .join(".")}/${runTime}`;
    try {
        const logFiles = (0, logFiles_1.getLogFilesForRuntime)(runTime);
        const logs = {};
        // Fetch all log files in parallel
        const logRequests = logFiles.map(async (file) => {
            try {
                const response = await fetch(`${basePath}/${file}`);
                if (!response.ok)
                    return null;
                const content = file.endsWith(".json")
                    ? await response.json()
                    : await response.text();
                return { file, content };
            }
            catch (err) {
                console.error(`Failed to fetch ${file}:`, err);
                return null;
            }
        });
        // Wait for all requests and populate logs
        const logResults = await Promise.all(logRequests);
        logResults.forEach((result) => {
            if (result) {
                logs[result.file] = result.content;
            }
        });
        // Ensure we fetch all standard logs
        for (const file of Object.values(logFiles_1.STANDARD_LOGS)) {
            if (!logs[file]) {
                try {
                    const response = await fetch(`${basePath}/${file}`);
                    if (response.ok) {
                        logs[file] = file.endsWith(".json")
                            ? await response.json()
                            : await response.text();
                    }
                }
                catch (err) {
                    console.error(`Failed to fetch ${file}:`, err);
                }
            }
        }
        // const logs = await logFiles.reduce(async (acc, file, i) => {
        //   acc[file.split(".")[0]] = await logRes[i].text();
        //   return acc;
        // }, {});
        // Check if we got any logs at all
        if (Object.keys(logs).length === 0) {
            return {
                logs: {},
                error: "No test logs found. The test may not have run or the report files are missing.",
            };
        }
        return {
            logs,
            error: null,
        };
    }
    catch (err) {
        return {
            // testData: null,
            logs: {},
            // typeErrors: "",
            // lintErrors: "",
            error: `Failed to load test data: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
};
exports.fetchTestData = fetchTestData;
const summaryDotJson = (name) => {
    return `/reports/${name}/summary.json`;
};
exports.summaryDotJson = summaryDotJson;
