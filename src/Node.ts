import net from "net";
import Testeranto from "./lib/core.js";
import {
  defaultTestResourceRequirement,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";
import type {
  Ibdd_in,
  Ibdd_out,
  INodeTestInterface,
  ITestImplementation,
  ITestInterface,
  ITestSpecification,
} from "./Types.js";
import { PM_Node } from "./PM/node.js";

export class NodeTesteranto<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> extends Testeranto<I, O> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O>,
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
    const pm = new PM_Node(t);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
    // const { failed, artifacts, logPromise, features } =
    //   await this.testJobs[0].receiveTestResourceConfig(pm);
    // // pm.customclose();
    // return { features, failed };
  }
}

const testeranto = async <
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O>,
  testInterface: Partial<INodeTestInterface<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<I, O>> => {
  const t = new NodeTesteranto<I, O>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );

  try {
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
