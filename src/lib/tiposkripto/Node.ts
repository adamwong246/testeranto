import fs from "fs";
import {
  Ibdd_in_any,
  Ibdd_out,
  Ibdd_out_any,
  ITestAdapter,
  ITestImplementation,
  ITestSpecification,
} from "../../CoreTypes.js";
import Tiposkripto from "./BaseTiposkripto.js";
import {
  defaultTestResourceRequirement,
  ITTestResourceRequest,
} from "./index.js";

console.log(`[NodeTiposkripto] ${process.argv}`);

const config = { ports: [1111], fs: 'testeranto/reports/allTests/example/Calculator.test/node' }

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
    console.log(`[NodeTiposkripto] constructor ${process.argv[3]}`);
    // const config = JSON.parse(process.argv[3])

    super(
      "node",
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      config
    );
  }

  writeFileSync(
    filename: string,
    payload: string,
  ) {
    // Ensure the directory exists
    const dir = "testeranto/reports/allTests/example";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Write to the exact filename provided
    fs.writeFileSync(filename, payload);
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
    return t;
  } catch (e) {
    console.error(`[Node] Error creating Tiposkripto:`, e);
    console.error(e.stack);
    process.exit(-1);
  }
};

export default tiposkripto;
