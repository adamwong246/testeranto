import net from "net";
import { ITTestResourceConfiguration } from "../../lib";
import { PM_Pure_Sidecar } from "../pureSidecar";
import Testeranto from "../../Node";
import {
  Ibdd_out,
  ITestSpecification,
  ITestImplementation,
  Ibdd_in_any,
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
  },
  {
    SidecarState: unknown;
  }
>;

const specification: ITestSpecification<Ibdd_in_any, O> = (
  Suite,
  Given,
  When,
  Then
) => {
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
        ),
      },
      []
    ),
  ];
};

const implementation: ITestImplementation<I, O> = {
  suites: { SidecarInitialized: (x) => x },
  givens: {
    SidecarReady: () => {
      const config: ITTestResourceConfiguration = {
        name: "test-pure-sidecar",
        fs: "/tmp",
        ports: [3001],
        browserWSEndpoint: "",
      };
      return new PM_Pure_Sidecar(config);
    },
  },
  whens: {
    SendTestMessage: (message) => async (sidecar: PM_Pure_Sidecar) => {
      let callbackFn: Function;
      process.on = (event: string, callback: Function) => {
        if (event === "message") {
          callbackFn = callback;
          callback(
            JSON.stringify({
              key: "mock-key",
              payload: message,
            })
          );
        }
      };

      let writeCalled = false;
      sidecar.client.write = (data: string) => {
        writeCalled = true;
        return true;
      };

      await sidecar.send("test-command", message);
      return { writeCalled, callbackFn };
    },
    VerifyCleanup: () => async (sidecar: PM_Pure_Sidecar) => {
      let addListenerCalled = false;
      let removeListenerCalled = false;

      process.addListener = () => (addListenerCalled = true);
      process.removeListener = () => (removeListenerCalled = true);

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
  checks: { SidecarState: () => "unknown" },
};

const testInterface: IPartialNodeInterface<I> = {
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
  () => new PM_Pure_Sidecar({} as ITTestResourceConfiguration),
  specification,
  implementation,
  testInterface
);
