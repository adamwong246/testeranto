import path from "path";
export async function loadConfig(configFilepath) {
    const testsName = path
        .basename(configFilepath)
        .split(".")
        .slice(0, -1)
        .join(".");
    const module = await import(`${process.cwd()}/${configFilepath}`);
    const bigConfig = module.default;
    const config = Object.assign(Object.assign({}, bigConfig), { buildDir: process.cwd() + "/testeranto/bundles/" + testsName });
    return { config, testsName };
}
