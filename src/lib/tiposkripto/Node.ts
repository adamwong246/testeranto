import {
  Ibdd_in_any,
  Ibdd_out,
  ITestAdapter,
  ITestImplementation,
  ITestSpecification,
} from "../CoreTypes.js";
import {
  defaultTestResourceRequirement,
  ITTestResourceRequest,
} from "./index.js";
import Tiposkripto from "./BaseTiposkripto.js";

const tiposkripto = async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
  testResourceConfiguration?: ITestResourceConfiguration
): Promise<Tiposkripto<I, O, M>> => {
  try {
    const wsPort = "3456";
    const wsHost = "host.docker.internal";

    const t = new Tiposkripto<I, O, M>(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      testResourceConfiguration,
      wsPort,
      wsHost
    );
    return t;
  } catch (e) {
    console.error(`[Node] Error creating Tiposkripto:`, e);
    console.error(e.stack);
    process.exit(-1);
  }
};

export default tiposkripto;
