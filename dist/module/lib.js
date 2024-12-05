// import { configs } from "eslint-plugin-react";
import path from "path";
export const destinationOfRuntime = (f, r, configs) => {
    return path
        .normalize(`${configs.buildDir}/${r}/${f}`)
        .split(".")
        .slice(0, -1)
        .join(".");
};
