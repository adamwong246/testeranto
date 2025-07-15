import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  PM_sidecar
} from "../../../chunk-PG6KUKNP.mjs";
import {
  Node_default
} from "../../../chunk-W44DUDBK.mjs";
import "../../../chunk-UED26IMH.mjs";

// src/PM/nodeSidecar.ts
import net from "net";
var PM_Node_Sidecar = class extends PM_sidecar {
  constructor(t) {
    super();
    this.testResourceConfiguration = t;
    this.client = {};
  }
  start(stopper) {
    return new Promise((res) => {
      process.on("message", async (message) => {
        if (message === "stop") {
          console.log("STOP!", stopper.toString());
          await stopper();
          process.exit();
        } else if (message.path) {
          this.client = net.createConnection(message.path, () => {
            res();
          });
        }
      });
    });
  }
  stop() {
    return new Promise((resolve) => {
      if (this.client) {
        this.client.end(() => resolve());
      } else {
        resolve();
      }
    });
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(Promise.resolve());
    };
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

// src/PM/__tests__/nodeSidecar.testeranto.ts
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.SidecarInitialized(
      "Sidecar message passing works correctly",
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
        name: "test-sidecar",
        fs: "/tmp",
        ports: [3001],
        browserWSEndpoint: ""
      };
      return new PM_Node_Sidecar(config);
    }
  },
  whens: {
    SendTestMessage: (message) => async (sidecar) => {
      let callbackFn;
      const mockProcess = {
        on: (event, callback) => {
          if (event === "message") {
            callbackFn = callback;
            callback(
              JSON.stringify({
                key: "mock-key",
                payload: message
              })
            );
          }
          return mockProcess;
        },
        addListener: () => mockProcess,
        removeListener: () => mockProcess
      };
      process = mockProcess;
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
      const mockProcess = {
        addListener: () => {
          addListenerCalled = true;
          return mockProcess;
        },
        removeListener: () => {
          removeListenerCalled = true;
          return mockProcess;
        }
      };
      process = mockProcess;
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
var nodeSidecar_testeranto_default = Node_default(
  () => new PM_Node_Sidecar({}),
  specification,
  implementation,
  testInterface
);
export {
  nodeSidecar_testeranto_default as default
};
