import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  init_cjs_shim
} from "./chunk-L67RWZ4W.mjs";

// src/lib/BaseSuite.test/mock.ts
init_cjs_shim();
var MockGiven = class extends BaseGiven {
  constructor(name, features, whens, thens) {
    super(
      name,
      features,
      whens,
      thens,
      async () => ({ testStore: true, testSelection: false }),
      // givenCB
      {}
      // initialValues
    );
  }
  async givenThat() {
    return { testStore: true, testSelection: false };
  }
  uberCatcher(e) {
    console.error("Given error 2:", e);
  }
};
var MockWhen = class extends BaseWhen {
  async andWhen(store, whenCB, testResource, pm) {
    const newStore = {
      ...store,
      testSelection: true
      // Ensure testSelection is set for assertions
    };
    const result = await whenCB(newStore);
    return result;
  }
  addArtifact(name, content) {
    return this;
  }
};
var MockThen = class extends BaseThen {
  async butThen(store, thenCB, testResourceConfiguration, pm) {
    const testSelection = {
      name: store.name,
      index: store.index,
      testSelection: store.testSelection || false,
      error: store.error ? true : void 0
    };
    try {
      const result = await thenCB(testSelection);
      if (!result || typeof result.testSelection === "undefined") {
        throw new Error(
          `Invalid test selection result: ${JSON.stringify(result)}`
        );
      }
      return result;
    } catch (e) {
      console.error("[ERROR] MockThen - butThen failed:", e);
      throw e;
    }
  }
};
var MockSuite = class extends BaseSuite {
  constructor(name, index) {
    if (!name) {
      throw new Error("MockSuite requires a non-empty name");
    }
    const suiteName = name || "testSuite";
    super(suiteName, index, {
      testGiven: new MockGiven(
        "testGiven",
        ["testFeature"],
        [new MockWhen("testWhen", () => Promise.resolve({ testStore: true }))],
        [
          new MockThen(
            "testThen",
            async () => Promise.resolve({ testSelection: true })
          )
        ]
      )
    });
  }
};

export {
  MockSuite
};
