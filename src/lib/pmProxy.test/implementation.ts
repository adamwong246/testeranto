import { I, M, O } from "./types";
import { ITestImplementation } from "../../CoreTypes";
// import { ITestProxies } from ".";
import { IPM } from "../types";
import { IProxiedFunctions, IProxy } from "../pmProxy";
import { MockPMBase } from "./mockPMBase";

export const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: "PM Proxy Tests",
  },

  givens: {
    SomeBaseString: (s: string) => s,
  },

  whens: {
    // functions have no mutations
  },
  thens: {
    theButTheProxyReturns:
      (method: IProxiedFunctions, expectedPath: string) =>
      (store: { butThenProxy: IProxy }) => {
        // Create a mock PM instance
        const mockPm = new MockPMBase() as unknown as IPM;
        const filepath = "test/path";

        // Apply the proxy
        const proxiedPm = store.butThenProxy(mockPm, filepath);

        // Verify the proxy modified the path correctly for the given method
        let actualPath: string;
        switch (method) {
          case "writeFileSync":
            proxiedPm.writeFileSync("test.txt", "content");
            actualPath = mockPm.getLastCall("writeFileSync")?.path;
            break;
          case "createWriteStream":
            proxiedPm.createWriteStream("stream.txt");
            actualPath = mockPm.getLastCall("createWriteStream")?.path;
            break;
          case "screencast":
            proxiedPm.screencast({ path: "screen.png" }, "test");
            actualPath = mockPm.getLastCall("screencast")?.opts?.path;
            break;
          case "customScreenShot":
            proxiedPm.customScreenShot({ path: "shot.png" }, "test");
            actualPath = mockPm.getLastCall("customScreenShot")?.opts?.path;
            break;
          default:
            throw new Error(`Unknown method: ${method}`);
        }

        // Return both the actual path and expected path for assertion
        return [actualPath, expectedPath];
      },
  },

  checks: {
    Default: (s: string) => s,
  },
};
