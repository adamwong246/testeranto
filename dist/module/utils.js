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
