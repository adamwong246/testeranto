"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTestData = exports.fetchProjectData = void 0;
const fetchProjectData = async (projectName) => {
    const [summaryRes, configRes] = await Promise.all([
        fetch(`reports/${projectName}/summary.json`),
        fetch("reports/config.json"),
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
        const [testRes, logsRes, typeRes, lintRes] = await Promise.all([
            fetch(`${basePath}/tests.json`),
            fetch(`${basePath}/logs.txt`),
            fetch(`${basePath}/type_errors.txt`),
            fetch(`${basePath}/lint_errors.txt`),
        ]);
        if (!testRes.ok) {
            return {
                testData: null,
                logs: await logsRes.text(),
                typeErrors: await typeRes.text(),
                lintErrors: await lintRes.text(),
                error: "Tests did not complete successfully. Please check the build and runtime logs for errors.",
            };
        }
        return {
            testData: await testRes.json(),
            logs: await logsRes.text(),
            typeErrors: await typeRes.text(),
            lintErrors: await lintRes.text(),
            error: null,
        };
    }
    catch (err) {
        return {
            testData: null,
            logs: "",
            typeErrors: "",
            lintErrors: "",
            error: `Failed to load test data: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
};
exports.fetchTestData = fetchTestData;
