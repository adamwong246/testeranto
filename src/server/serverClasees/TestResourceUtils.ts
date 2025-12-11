/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TestResourceConfig {
    name: string;
    fs: string;
    ports: number[];
    browserWSEndpoint?: string;
    timeout?: number;
    retries?: number;
    environment?: Record<string, string>;
}

export function prepareTestResources(
    testResources: any,
    portsToUse: string[],
    src: string,
    reportDest: string
): string {
    let testResourcesObj: any;
    
    // Parse if it's a string
    if (typeof testResources === "string") {
        try {
            testResourcesObj = JSON.parse(testResources);
        } catch (e) {
            console.error("Failed to parse testResources string:", e);
            testResourcesObj = {};
        }
    } else {
        testResourcesObj = testResources || {};
    }

    // Ensure ports are included
    if (portsToUse && portsToUse.length > 0) {
        // Convert port strings to numbers
        testResourcesObj.ports = portsToUse.map((p) => parseInt(p, 10));
    } else {
        testResourcesObj.ports = testResourcesObj.ports || [];
    }

    // Make sure other required fields are present
    testResourcesObj.name = testResourcesObj.name || src;
    // KEY FIX: fs should be the path to the test file, not the report directory
    // src is the test file path (e.g., "src/tests/Calculator.test.ts")
    // In Docker, this becomes "/workspace/src/tests/Calculator.test.ts"
    testResourcesObj.fs = testResourcesObj.fs || src;
    testResourcesObj.browserWSEndpoint = testResourcesObj.browserWSEndpoint || "no-browser";
    testResourcesObj.timeout = testResourcesObj.timeout || 30000;
    testResourcesObj.retries = testResourcesObj.retries || 3;

    // When running in Docker, tests need to connect to the host, not localhost
    // Check if we're in a Docker environment
    if (process.env.IN_DOCKER === 'true' || process.env.DOCKER_CONTAINER) {
        // For containers, use host.docker.internal to reach the host
        testResourcesObj.wsHost = "host.docker.internal";
        console.log("TestResourceUtils: Setting wsHost to host.docker.internal for Docker environment");
    } else {
        testResourcesObj.wsHost = "localhost";
    }

    // Stringify to JSON
    return JSON.stringify(testResourcesObj);
}

export function escapeForShell(arg: string): string {
    // Escape single quotes and wrap in single quotes
    return "'" + arg.replace(/'/g, "'\"'\"'") + "'";
}
