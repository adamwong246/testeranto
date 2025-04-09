import path from "path";
export const destinationOfRuntime = (f, r, configs) => {
    return path
        .normalize(`${configs.buildDir}/${r}/${f}`)
        .split(".")
        .slice(0, -1)
        .join(".");
};
export const tscPather = (entryPoint, platform, projectName) => {
    return path.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `type_errors.txt`);
};
export const lintPather = (entryPoint, platform, projectName) => {
    return path.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `lint_errors.json`);
};
export const bddPather = (entryPoint, platform, projectName) => {
    return path.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `tests.json`);
};
export const promptPather = (entryPoint, platform, projectName) => {
    return path.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `prompt.txt`);
};
export const getRunnables = (tests, projectName, payload = {
    nodeEntryPoints: {},
    webEntryPoints: {},
    importEntryPoints: {},
}) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt.nodeEntryPoints[cv[0]] = path.resolve(`./testeranto/bundles/node/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        }
        else if (cv[1] === "web") {
            pt.webEntryPoints[cv[0]] = path.resolve(`./testeranto/bundles/web/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        }
        else if (cv[1] === "pure") {
            pt.importEntryPoints[cv[0]] = path.resolve(`./testeranto/bundles/pure/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        }
        // if (cv[3].length) {
        //   getRunnables(cv[3], testName, payload);
        // }
        return pt;
    }, payload);
};
