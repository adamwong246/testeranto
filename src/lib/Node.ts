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
    console.log(`receiveTestResourceConfig: wsPort is ${wsPort}`);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const execer = process.argv[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const builtFile: string = process.argv[1];

    wsPort = process.argv[2];
    console.log("wsPort ?!?!", wsPort);

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
