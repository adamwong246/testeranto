/* eslint-disable @typescript-eslint/no-explicit-any */
// import WebSocket from "ws";
import {
  defaultTestResourceRequirement,
  ITTestResourceRequest,
} from "./index.js";

import {
  ITestSpecification,
  ITestImplementation,
  ITestAdapter,
  Ibdd_in_any,
  Ibdd_out,
} from "../CoreTypes.js";
import Tiposkripto from "./Tiposkripto.js";

const tiposkripto = async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Tiposkripto<I, O, M>> => {
  try {
    const wsPort = "3456";
    const wsHost = "host.docker.internal";
    console.log(
      `[Node] Creating Tiposkripto instance with WebSocket host: ${wsHost}, port: ${wsPort}`
    );
    console.log(`[Node] Current directory: ${process.cwd()}`);
    console.log(`[Node] Environment WS_PORT: ${wsPort}`);
    console.log(`[Node] Environment WS_HOST: ${wsHost}`);

    const t = new Tiposkripto<I, O, M>(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      wsPort,
      wsHost
    );

    console.log(`[Node] Tiposkripto instance created successfully`);
    return t;
  } catch (e) {
    console.error(`[Node] Error creating Tiposkripto:`, e);
    console.error(e.stack);
    process.exit(-1);
  }
};

export default tiposkripto;
