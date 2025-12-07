import {
  Ibdd_in_any,
  Ibdd_out,
  ITestSpecification,
  ITestImplementation,
  ITestAdapter,
} from "./CoreTypes";
import { ITTestResourceRequest, defaultTestResourceRequirement } from "./lib";
import type Tiposkripto from "./lib/Tiposkripto.js";

let tpskrt;

// Use esbuild define to distinguish environments
declare const ENV: "node" | "web";
if (ENV === "node") {
  tpskrt = await import("./lib/Node");
} else if (ENV === "web") {
  tpskrt = await import("./lib/Web");
} else {
  throw `Unknown ENV ${ENV}`;
}

export default async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Tiposkripto<I, O, M>> => {
  return (
    (await tpskrt.default) as unknown as <
      II extends Ibdd_in_any,
      OO extends Ibdd_out,
      MM
    >(
      input: II["iinput"],
      testSpecification: ITestSpecification<II, OO>,
      testImplementation: ITestImplementation<II, OO, MM>,
      testResourceRequirement: ITTestResourceRequest,
      testAdapter: Partial<ITestAdapter<II>>
    ) => Promise<Tiposkripto<II, OO, MM>>
  )<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter
  );
};
