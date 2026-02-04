import { ITestResourceConfiguration } from "./types";
import { Ibdd_in_any, ITestAdapter, Ibdd_out, ITestImplementation, ITestSpecification } from "./CoreTypes";
import type BaseTiposkripto from "./BaseTiposkripto.js";
import { ITTestResourceRequest, defaultTestResourceRequirement } from "./types";

// let tpskrt;

// // Use esbuild define to distinguish environments
// declare const ENV: "node" | "web";
// if (ENV === "node") {
//   tpskrt = await import("./Node");
// } else if (ENV === "web") {
//   tpskrt = await import("./Web");
// } else {
//   throw `Unknown ENV ${ENV}`;
// }

let tpskrt;
const tpskrtNode = await import("./Node");
// const tpskrtWeb = await import("./Web");

tpskrt = tpskrtNode
// Use esbuild define to distinguish environments
// declare const ENV: "node" | "web";

// if (ENV === "node") {
//   tpskrt = tpskrtNode
// } else if (ENV === "web") {
//   tpskrt = tpskrtWeb
// } else {
//   throw `Unknown ENV ${ENV}`;
// }

export default async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
  testResourceConfiguration?: ITestResourceConfiguration
): Promise<BaseTiposkripto<I, O, M>> => {
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
      testAdapter: Partial<ITestAdapter<II>>,
      testResourceConfiguration?: ITestResourceConfiguration
    ) => Promise<BaseTiposkripto<II, OO, MM>>
  )<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter,
    testResourceConfiguration
  );
};

export const BaseAdapter = <T extends Ibdd_in_any>(): ITestAdapter<T> => ({
  beforeAll: async (
    input: T["iinput"],
    testResource: ITestResourceConfiguration
  ) => {
    return input as unknown as T["isubject"];
  },
  beforeEach: async function (
    subject: T["isubject"],
    initializer: (c?: any) => T["given"],
    testResource: ITestResourceConfiguration,
    initialValues: any
  ): Promise<T["istore"]> {
    return subject as unknown as T["istore"];
  },
  afterEach: async (store: T["istore"], key: string) => Promise.resolve(store),
  afterAll: (store: T["istore"]) => undefined,
  butThen: async (
    store: T["istore"],
    thenCb: T["then"],
    testResource: ITestResourceConfiguration
  ) => {
    return thenCb(store);
  },
  andWhen: async (
    store: T["istore"],
    whenCB: T["when"],
    testResource: ITestResourceConfiguration
  ) => {
    return whenCB(store);
  },
  assertThis: (x: T["then"]) => x,
});

export const DefaultAdapter = <T extends Ibdd_in_any>(
  p: Partial<ITestAdapter<T>>
): ITestAdapter<T> => {
  const base = BaseAdapter<T>();
  return {
    ...base,
    ...p,
  } as ITestAdapter<T>;
};

