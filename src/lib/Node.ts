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
    // Parse the test resource configuration
    const config = JSON.parse(partialTestResource);
    const wsUrl: string = `ws://localhost:${wsPort}`;
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

    wsPort = process.argv[3];

    process.exit((await t.receiveTestResourceConfig(process.argv[2])).fails);
  } catch (e) {
    console.error(e);
    console.error(e.stack);
    process.exit(-1);
  }
};

export default tiposkripto;
