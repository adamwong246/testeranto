import {
  defaultTestResourceRequirement,
  ITTestResourceRequest,
} from "./index.js";
import { PM_Node } from "../clients/node.js";
import {
  ITestSpecification,
  ITestImplementation,
  ITestAdapter,
  Ibdd_in_any,
  Ibdd_out_any,
  Ibdd_out,
} from "../CoreTypes.js";
import Tiposkripto from "./Tiposkripto.js";

let wsPort;

export class NodeTiposkripto<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M
> extends Tiposkripto<I, O, M> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
    testResourceRequirement: ITTestResourceRequest,
    testAdapter: Partial<ITestAdapter<I>>
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      () => {
        // no-op
      }
    );
  }

  async receiveTestResourceConfig(partialTestResource: string) {
    console.log("node.receiveTestResourceConfig", partialTestResource);
    // Parse the test resource configuration
    const config = JSON.parse(partialTestResource);
    // Read WebSocket host from environment variable, default to localhost
    const wsHost = process.env.WS_HOST || "localhost";
    const wsUrl: string = `ws://${wsHost}:${wsPort}`;
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    return await this.testJobs[0].receiveTestResourceConfig(
      new PM_Node(config, wsUrl)
    );
  }
}

const tiposkripto = async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Tiposkripto<I, O, M>> => {
  try {
    // Ensure IPC is not used - node tests should only use WebSocket
    if (process.send) {
      console.warn(
        "IPC is available via process.send, but node tests should use WebSocket only"
      );
      // Don't use IPC - override process.send to prevent accidental usage
      // const originalSend = process.send;
      process.send = function (...args: any[]) {
        console.error(
          "IPC usage detected via process.send(). Node tests should use WebSocket via PM_Node instead."
        );
        console.error("The IPC message was:", args);
        // Don't actually send the message
        return false;
      };
    }

    const t = new NodeTiposkripto<I, O, M>(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter
    );

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      // Optionally, terminate the process or perform cleanup
      // t.registerUncaughtPromise(reason, promise);
    });

    // console.log("node.tiposkripto", process.argv);

    // Read WebSocket port from environment variable for congruence with Python and Golang
    // wsPort = process.env.WS_PORT || "3000";

    console.log("wtf", process.argv.toString());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const execer = process.argv[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const builtFile: string = process.argv[1];

    wsPort = process.argv[2];

    const testResource: string = process.argv[3];
    // // Read WebSocket port from command line argument (process.argv[3]) or environment variable
    // wsPort = process.argv[2];
    // if (!wsPort) {
    //   console.error("wsPort is undefind");
    // }
    process.exit((await t.receiveTestResourceConfig(testResource)).fails);
  } catch (e) {
    console.error(e);
    console.error(e.stack);
    process.exit(-1);
  }
};

export default tiposkripto;
