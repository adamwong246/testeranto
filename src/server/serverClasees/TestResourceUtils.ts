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
    testResourcesObj.fs = testResourcesObj.fs || reportDest;
    testResourcesObj.browserWSEndpoint = testResourcesObj.browserWSEndpoint || "no-browser";
    testResourcesObj.timeout = testResourcesObj.timeout || 30000;
    testResourcesObj.retries = testResourcesObj.retries || 3;

    // Stringify to JSON
    return JSON.stringify(testResourcesObj);
}

export function escapeForShell(arg: string): string {
    // Escape single quotes and wrap in single quotes
    return "'" + arg.replace(/'/g, "'\"'\"'") + "'";
}
