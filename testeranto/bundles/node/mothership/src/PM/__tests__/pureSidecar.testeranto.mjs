import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  PM_sidecar
} from "../../../chunk-PG6KUKNP.mjs";
import {
  Node_default
} from "../../../chunk-V2EQEXU2.mjs";

// src/PM/pureSidecar.ts
import net from "net";
var PM_Pure_Sidecar = class extends PM_sidecar {
  constructor(t) {
    super();
    this.testResourceConfiguration = t;
  }
  start() {
    return new Promise((res) => {
      process.on("message", (message) => {
        if (message.path) {
          this.client = net.createConnection(message.path, () => {
            res();
          });
        }
      });
    });
  }
  stop() {
    throw new Error("stop not implemented.");
  }
  send(command, ...argz) {
    return new Promise((res) => {
      const key = Math.random().toString();
      const myListener = (event) => {
        const x = JSON.parse(event);
        if (x.key === key) {
          process.removeListener("message", myListener);
          res(x.payload);
        }
      };
      process.addListener("message", myListener);
      this.client.write(JSON.stringify([command, ...argz, key]));
    });
  }
};

// src/PM/__tests__/pureSidecar.testeranto.ts
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.SidecarInitialized(
      "Pure Sidecar message passing works correctly",
      {
        basicSend: Given.SidecarReady(
          ["can send and receive messages"],
          [When.SendTestMessage("test-message")],
          [Then.MessageReceived("test-message")]
        ),
        cleanup: Given.SidecarReady(
          ["cleans up listeners after message"],
          [When.VerifyCleanup()],
          [Then.ListenersCleaned()]
        )
      },
      []
    )
  ];
};
var implementation = {
  suites: { SidecarInitialized: (x) => x },
  givens: {
    SidecarReady: () => {
      const config = {
        name: "test-pure-sidecar",
        fs: "/tmp",
        ports: [3001],
        browserWSEndpoint: ""
      };
      return new PM_Pure_Sidecar(config);
    }
  },
  whens: {
    SendTestMessage: (message) => async (sidecar) => {
      let callbackFn;
      process.on = (event, callback) => {
        if (event === "message") {
          callbackFn = callback;
          callback(
            JSON.stringify({
              key: "mock-key",
              payload: message
            })
          );
        }
      };
      let writeCalled = false;
      sidecar.client.write = (data) => {
        writeCalled = true;
        return true;
      };
      await sidecar.send("test-command", message);
      return { writeCalled, callbackFn };
    },
    VerifyCleanup: () => async (sidecar) => {
      let addListenerCalled = false;
      let removeListenerCalled = false;
      process.addListener = () => addListenerCalled = true;
      process.removeListener = () => removeListenerCalled = true;
      await sidecar.send("test-command", "test");
      return { addListenerCalled, removeListenerCalled };
    }
  },
  thens: {
    MessageReceived: (expected) => (actual) => {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}" but got "${actual}"`);
      }
      return actual;
    },
    ListenersCleaned: () => (result, { removeListenerCalled }) => {
      if (!removeListenerCalled) {
        throw new Error("Expected removeListener to be called");
      }
      return result;
    }
  },
  checks: { SidecarState: () => "unknown" }
};
var testInterface = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    const sidecar = initializer();
    sidecar.client = {
      write: () => true,
      end: () => {
      },
      on: () => {
      }
    };
    return sidecar;
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    try {
      await whenCB(store, testResource, pm);
    } catch (e) {
      console.error("Error in andWhen:", e);
      throw e;
    }
  }
};
var pureSidecar_testeranto_default = Node_default(
  () => new PM_Pure_Sidecar({}),
  specification,
  implementation,
  testInterface
);
export {
  pureSidecar_testeranto_default as default
};
