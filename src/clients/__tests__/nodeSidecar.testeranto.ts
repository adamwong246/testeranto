/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import net from "net";
import { ITTestResourceConfiguration } from "../../tiposkripto";
import { PM_Node_Sidecar } from "../nodeSidecar";
import Testeranto from "../../tiposkripto/Node";
import {
  Ibdd_in_any,
  Ibdd_out,
  ITestAdapter,
  ITestImplementation,
  ITestSpecification,
} from "../../CoreTypes";

type O = Ibdd_out<
  {
    SidecarInitialized: [null];
  },
  {
    SidecarReady: [];
  },
  {
    SendTestMessage: [string];
    VerifyCleanup: [];
  },
  {
    MessageReceived: [string];
    ListenersCleaned: [];
  }
>;

type I = Ibdd_in_any;

const specification: ITestSpecification<Ibdd_in_any, O> = (
  Suite,
  Given,
  When,
  Then
) => {
  return [
    Suite.SidecarInitialized("Sidecar message passing works correctly", {
      basicSend: Given.SidecarReady(
        ["can send and receive messages"],
        [When.SendTestMessage("test-message")],
        [Then.MessageReceived("test-message")]
      ),
      cleanup: Given.SidecarReady(
        ["cleans up listeners after message"],
        [When.VerifyCleanup()],
        [Then.ListenersCleaned()]
      ),
    }),
  ];
};

const implementation: ITestImplementation<I, O> = {
  suites: { SidecarInitialized: (x) => x },
  givens: {
    SidecarReady: () => {
      const config: ITTestResourceConfiguration = {
        name: "test-sidecar",
        fs: "/tmp",
        ports: [3001],
        browserWSEndpoint: "",
      };
      return new PM_Node_Sidecar(config);
    },
  },
  whens: {
    SendTestMessage: (message) => async (sidecar: PM_Node_Sidecar) => {
      let callbackFn: Function;
      const mockProcess = {
        on: (event: string, callback: Function) => {
          if (event === "message") {
            callbackFn = callback;
            callback(
              JSON.stringify({
                key: "mock-key",
                payload: message,
              })
            );
          }
          return mockProcess;
        },
        addListener: () => mockProcess,
        removeListener: () => mockProcess,
      } as unknown as NodeJS.Process;

      process = mockProcess;

      let writeCalled = false;
      sidecar.client.write = (data: string) => {
        writeCalled = true;
        return true;
      };

      await sidecar.send("test-command", message);
      return { writeCalled, callbackFn };
    },
    VerifyCleanup: () => async (sidecar: PM_Node_Sidecar) => {
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
        },
      } as unknown as NodeJS.Process;
      process = mockProcess;

      await sidecar.send("test-command", "test");
      return { addListenerCalled, removeListenerCalled };
    },
  },
  thens: {
    MessageReceived: (expected) => (actual) => {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}" but got "${actual}"`);
      }
      return actual;
    },
    ListenersCleaned:
      () =>
      (result, { removeListenerCalled }) => {
        if (!removeListenerCalled) {
          throw new Error("Expected removeListener to be called");
        }
        return result;
      },
  },
};

const testAdapter: ITestAdapter<I> = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    const sidecar = initializer();
    sidecar.client = {
      write: () => true,
      end: () => {},
      on: () => {},
    } as unknown as net.Socket;
    return sidecar;
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    try {
      await whenCB(store, testResource, pm);
    } catch (e) {
      console.error("Error in andWhen:", e);
      throw e;
    }
  },
};

export default Testeranto(
  () => new PM_Node_Sidecar({} as ITTestResourceConfiguration),
  specification,
  implementation,
  testAdapter
);
