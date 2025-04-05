import path from "path";
export const destinationOfRuntime = (f, r, configs) => {
    return path
        .normalize(`${configs.buildDir}/${r}/${f}`)
        .split(".")
        .slice(0, -1)
        .join(".");
};
export const tscPather = (entryPoint, platform) => {
    return path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `type_errors.txt`);
};
export const tscExitCodePather = (entryPoint, platform) => {
    return path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `type_errors.txt`);
};
export const lintPather = (entryPoint, platform) => {
    return path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `lint_errors.json`);
};
export const lintExitCodePather = (entryPoint, platform) => {
    return path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `lint_errors.txt`);
};
export const bddPather = (entryPoint, platform) => {
    return path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
};
export const bddExitCodePather = (entryPoint, platform) => {
    return path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `bdd_errors.txt`);
};
export const promptPather = (entryPoint, platform) => {
    return path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `prompt.txt`);
};
