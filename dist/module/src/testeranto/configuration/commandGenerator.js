import path from "path";
export function getCommandForRuntime(runtime, testName) {
    // testName is the entry point path, e.g., "src/example/Calculator.test.ts"
    const entryPointName = path.basename(testName, path.extname(testName));
    switch (runtime) {
        case "node":
            // The built file will be at testeranto/bundles/node/[configName]/[entryPointName].mjs
            // We need to know the config name, but it's not passed here
            // For now, let's assume it's in a standard location
            return `node testeranto/bundles/node/allTests/${entryPointName}.mjs`;
        case "web":
            return `node testeranto/bundles/web/allTests/${entryPointName}.mjs`;
        case "python":
            // For python, use pytest to run the test file
            return `python ${testName} `;
        case "golang":
            // For golang test files, use go test
            return `go test ${testName}`;
        default:
            return "echo 'Unknown runtime'";
    }
}
export function getCommandForBuildRuntime(runtime, mode = "once") {
    const configFilePath = process.argv[2];
    if (mode === "once") {
        // For once mode, the build happens during Docker build, so just echo
        return "echo 'Build completed during image build'";
    }
    else {
        // For dev mode, run the build command
        switch (runtime) {
            case "node":
                return `node --import tsx ./node.mjs ${configFilePath}`;
            case "web":
                return `node --import tsx ./web.mjs ${configFilePath}`;
            case "golang":
                return `node --import tsx ./golang.mjs ${configFilePath}`;
            case "python":
                return `node --import tsx ./python.mjs ${configFilePath}`;
            default:
                return "echo 'Unknown runtime'";
        }
    }
}
