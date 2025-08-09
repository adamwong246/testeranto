import Testeranto from "./lib/core.js";
import {
  defaultTestResourceRequirement,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";
import { PM_Node } from "./PM/node.js";
import {
  ITestSpecification,
  ITestImplementation,
  ITestAdapter,
  Ibdd_in_any,
  Ibdd_out_any,
  Ibdd_out,
} from "./CoreTypes.js";

let ipcfile;

export class NodeTesteranto<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M
> extends Testeranto<I, O, M> {
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
    // console.log("receiveTestResourceConfig", partialTestResource);
    const t: ITTestResourceConfiguration = JSON.parse(partialTestResource);
    const pm = new PM_Node(t, ipcfile);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
}

const testeranto = async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<I, O, M>> => {
  try {
    const t = new NodeTesteranto<I, O, M>(
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

    ipcfile = process.argv[3];
    const f = await t.receiveTestResourceConfig(process.argv[2]);

    console.error("goodbye node with failures", f.fails);
    process.exit(f.fails);
  } catch (e) {
    console.error("goodbye node with caught error", e);
    process.exit(-1);
  }
};

export default testeranto;
