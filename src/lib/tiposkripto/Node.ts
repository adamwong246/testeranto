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
      JSON.parse(process.argv[3])
    );
  }

  async writeFileSync({
    filename,
    payload,
  }: {
    filename: string;
    payload: any;
  }) {
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
