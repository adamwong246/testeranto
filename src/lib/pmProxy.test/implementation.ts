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
        const mockPm = new MockPMBase() as unknown as IPM;
        const filepath = "test/path";
        const proxiedPm = store.butThenProxy(mockPm, filepath);

        let actualPath: string;
        let actualContent: any;
        
        try {
          switch (method) {
            case "writeFileSync":
              const content = expectedPath.includes('content') ? 
                "test content" : "default content";
              proxiedPm.writeFileSync(
                expectedPath.includes('empty') ? "" : 
                expectedPath.includes('nested') ? "nested/folder/test.txt" :
                expectedPath.includes('spaces') ? "file with spaces.txt" :
                expectedPath.includes('invalid') ? "../invalid.txt" :
                "test.txt", 
                content
              );
              actualPath = mockPm.getLastCall("writeFileSync")?.path;
              actualContent = mockPm.getLastCall("writeFileSync")?.content;
              break;

            case "createWriteStream":
              proxiedPm.createWriteStream(
                expectedPath.includes('empty') ? "" : "stream.txt"
              );
              actualPath = mockPm.getLastCall("createWriteStream")?.path;
              break;

            case "screencast":
              proxiedPm.screencast(
                { 
                  path: "screen.png",
                  quality: 80,
                  fullPage: true 
                }, 
                "test"
              );
              actualPath = mockPm.getLastCall("screencast")?.opts?.path;
              actualContent = mockPm.getLastCall("screencast")?.opts;
              break;

            case "customScreenShot":
              proxiedPm.customScreenShot(
                { path: "shot.png" }, 
                "test"
              );
              actualPath = mockPm.getLastCall("customScreenShot")?.opts?.path;
              break;

            default:
              throw new Error(`Unknown method: ${method}`);
          }

          if (expectedPath === undefined) {
            return [undefined, undefined];
          }

          return [actualPath, expectedPath, actualContent];
        } catch (error) {
          return [error.message, expectedPath];
        }
      },

    verifyContent: (expectedContent: any) => (result: any[]) => {
      const actualContent = result[2];
      if (JSON.stringify(actualContent) !== JSON.stringify(expectedContent)) {
        throw new Error(
          `Content mismatch. Expected: ${JSON.stringify(expectedContent)}, Got: ${JSON.stringify(actualContent)}`
        );
      }
      return result;
    },
  },

  checks: {
    Default: (s: string) => s,
  },
};
