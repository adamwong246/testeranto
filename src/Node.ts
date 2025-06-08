import Testeranto from "./lib/core.js";
import {
  defaultTestResourceRequirement,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";
import type {
  INodeTestInterface,
  IT,
  ITestImplementation,
  ITestInterface,
  ITestSpecification,
  OT,
} from "./Types.js";
import { PM_Node } from "./PM/node.js";

let ipcfile;

export class NodeTesteranto<I extends IT, O extends OT, M> extends Testeranto<
  I,
  O,
  M
> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
    testResourceRequirement: ITTestResourceRequest,
    testInterface: Partial<ITestInterface<I>>
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface,
      () => {
        // no-op
      }
    );
  }

  async receiveTestResourceConfig(partialTestResource: string) {
    const t: ITTestResourceConfiguration = JSON.parse(partialTestResource);
    const pm = new PM_Node(t, ipcfile);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
    // const { failed, artifacts, logPromise, features } =
    //   await this.testJobs[0].receiveTestResourceConfig(pm);
    // // pm.customclose();
    // return { features, failed };
  }
}

const testeranto = async <I extends IT, O extends OT, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testInterface: Partial<INodeTestInterface<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<I, O, M>> => {
  const t = new NodeTesteranto<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Optionally, terminate the process or perform cleanup
    // t.registerUncaughtPromise(reason, promise);
  });

  try {
    ipcfile = process.argv[3];
    const f = await t.receiveTestResourceConfig(process.argv[2]);

    console.error("goodbye node error", f.fails);
    process.exit(f.fails);
  } catch (e) {
    console.error("goodbye node error", e);
    process.exit(-1);

    // fs.writeFileSync(`tests.json`, JSON.stringify(t.,
    //  null, 2));
    // process.send({ message: "Hello from child!" });
    // process.on("message", (message) => {
    //   const client = net.createConnection(message.path, () => {

    //     console.error("goodbye node error", e);
    //     process.exit(-1);
    //   });
    // });
  }

  return t;
};

export default testeranto;
