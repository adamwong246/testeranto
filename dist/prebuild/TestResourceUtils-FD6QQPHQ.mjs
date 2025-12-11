import "./chunk-3X2YHN6Q.mjs";

// src/server/serverClasees/TestResourceUtils.ts
function prepareTestResources(testResources, portsToUse, src, reportDest) {
  let testResourcesObj;
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
  if (portsToUse && portsToUse.length > 0) {
    testResourcesObj.ports = portsToUse.map((p) => parseInt(p, 10));
  } else {
    testResourcesObj.ports = testResourcesObj.ports || [];
  }
  testResourcesObj.name = testResourcesObj.name || src;
  testResourcesObj.fs = testResourcesObj.fs || src;
  testResourcesObj.browserWSEndpoint = testResourcesObj.browserWSEndpoint || "no-browser";
  testResourcesObj.timeout = testResourcesObj.timeout || 3e4;
  testResourcesObj.retries = testResourcesObj.retries || 3;
  if (process.env.IN_DOCKER === "true" || process.env.DOCKER_CONTAINER) {
    testResourcesObj.wsHost = "host.docker.internal";
    console.log(
      "TestResourceUtils: Setting wsHost to host.docker.internal for Docker environment"
    );
  } else {
    testResourcesObj.wsHost = "localhost";
  }
  return JSON.stringify(testResourcesObj);
}
function escapeForShell(arg) {
  return "'" + arg.replace(/'/g, `'"'"'`) + "'";
}
export {
  escapeForShell,
  prepareTestResources
};
