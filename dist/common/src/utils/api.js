"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBuildLogs = exports.fetchTestData = exports.fetchProjectData = void 0;
const fetchProjectData = async (projectName) => {
    const [summaryRes, configRes] = await Promise.all([
        fetch(`/testeranto/reports/${projectName}/summary.json`),
        fetch("/testeranto/reports/config.json"),
    ]);
    return {
        summary: (await summaryRes.json()),
        config: (await configRes.json()),
    };
};
exports.fetchProjectData = fetchProjectData;
const fetchTestData = async (projectName, filepath, runTime) => {
    const basePath = `/testeranto/reports/${projectName}/${filepath}/${runTime}`;
    const [testRes, logsRes, typeRes, lintRes] = await Promise.all([
        fetch(`${basePath}/tests.json`),
        fetch(`${basePath}/logs.txt`),
        fetch(`${basePath}/type_errors.txt`),
        fetch(`${basePath}/lint_errors.txt`),
    ]);
    return {
        // testData: await testRes.json(),
        testData: fakeTestJson,
        logs: await logsRes.text(),
        typeErrors: await typeRes.text(),
        lintErrors: await lintRes.text(),
    };
};
exports.fetchTestData = fetchTestData;
const fetchBuildLogs = async (projectName, runtime) => {
    const res = await fetch(`/testeranto/reports/${projectName}/src/lib/${projectName}.${testName}/${runtime}/metafile.json`);
    return await res.json();
};
exports.fetchBuildLogs = fetchBuildLogs;
const fakeTestJson = {
    name: "Testing the Rectangle class",
    givens: [
        {
            key: "test0",
            name: "Default",
            whens: [
                {
                    name: "setWidth: 4",
                    error: true,
                },
                {
                    name: "setHeight: 19",
                    error: true,
                },
            ],
            thens: [
                {
                    name: "getWidth: 4",
                    error: false,
                },
                {
                    name: "getHeight: 19",
                    error: false,
                },
            ],
            error: null,
            features: [
                "https://api.github.com/repos/adamwong246/testeranto/issues/8",
            ],
        },
        {
            key: "test1",
            name: "Default",
            whens: [
                {
                    name: "setWidth: 4",
                    error: true,
                },
                {
                    name: "setHeight: 5",
                    error: true,
                },
            ],
            thens: [
                {
                    name: "getWidth: 4",
                    error: false,
                },
                {
                    name: "getHeight: 5",
                    error: false,
                },
                {
                    name: "area: 20",
                    error: false,
                },
                {
                    name: "AreaPlusCircumference: 38",
                    error: false,
                },
            ],
            error: null,
            features: ["Rectangles have width and height."],
        },
        {
            key: "test2",
            name: "Default",
            whens: [
                {
                    name: "setHeight: 4",
                    error: true,
                },
                {
                    name: "setWidth: 33",
                    error: true,
                },
            ],
            thens: [
                {
                    name: "area: 132",
                    error: false,
                },
            ],
            error: null,
            features: ["Rectangles have area"],
        },
        {
            key: "test2_1",
            name: "Default",
            whens: [],
            thens: [
                {
                    name: "getWidth: 2",
                    error: false,
                },
                {
                    name: "getHeight: 2",
                    error: false,
                },
            ],
            error: null,
            features: ["Rectangles have default size"],
        },
        {
            key: "test3",
            name: "Default",
            whens: [
                {
                    name: "setHeight: 5",
                    error: true,
                },
                {
                    name: "setWidth: 5",
                    error: true,
                },
            ],
            thens: [
                {
                    name: "area: 25",
                    error: false,
                },
            ],
            error: null,
            features: [
                "file:///Users/adam/Code/testeranto-starter/src/Rectangle/README.md",
            ],
        },
        {
            key: "test4",
            name: "Default",
            whens: [
                {
                    name: "setHeight: 6",
                    error: true,
                },
                {
                    name: "setWidth: 6",
                    error: true,
                },
            ],
            thens: [
                {
                    name: "area: 36",
                    error: false,
                },
            ],
            error: null,
            features: ["Rectangles have area"],
        },
        {
            key: "test5",
            name: "Default",
            whens: [],
            thens: [
                {
                    name: "getWidth: 2",
                    error: false,
                },
                {
                    name: "getHeight: 2",
                    error: false,
                },
            ],
            error: null,
            features: ["Rectangles have default size, again"],
        },
    ],
    checks: [],
    fails: 0,
    features: [
        "https://api.github.com/repos/adamwong246/testeranto/issues/8",
        "Rectangles have width and height.",
        "Rectangles have area",
        "Rectangles have default size",
        "file:///Users/adam/Code/testeranto-starter/src/Rectangle/README.md",
        "Rectangles have default size, again",
    ],
};
