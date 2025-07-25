import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen
} from "./chunk-Y52V2EMF.mjs";

// src/lib/BaseSuite.test/mock.ts
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
    console.log(
      "[DEBUG] MockWhen - andWhen - input store:",
      JSON.stringify(store)
    );
    const newStore = {
      ...store,
      testSelection: true
      // Ensure testSelection is set for assertions
    };
    console.log("[DEBUG] MockWhen - andWhen - calling whenCB");
    const result = await whenCB(newStore);
    console.log("[DEBUG] MockWhen - andWhen - result:", JSON.stringify(result));
    return result;
  }
  addArtifact(name, content) {
    return this;
  }
};
var MockThen = class extends BaseThen {
  async butThen(store, thenCB, testResourceConfiguration, pm) {
    console.log(
      "[DEBUG] MockThen - butThen - input store:",
      JSON.stringify(store)
    );
    if (!store) {
      throw new Error("Store is undefined in butThen");
    }
    const testSelection = {
      name: store.name,
      index: store.index,
      testSelection: store.testSelection || false,
      error: store.error ? true : void 0
    };
    console.log(
      "[DEBUG] MockThen - passing testSelection:",
      JSON.stringify(testSelection)
    );
    try {
      const result = await thenCB(testSelection);
      console.log(
        "[DEBUG] MockThen - received result:",
        JSON.stringify(result)
      );
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
    console.log("[DEBUG] Creating MockSuite with name:", name, "index:", index);
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
    console.log("[DEBUG] MockSuite created:", this.name, this.index);
  }
};

export {
  MockSuite
};
