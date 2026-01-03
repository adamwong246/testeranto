/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defaultTestResourceRequirement,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./index.js";

import {
  ITestSpecification,
  ITestImplementation,
  ITestAdapter,
  Ibdd_in_any,
  Ibdd_out_any,
  Ibdd_out,
} from "../CoreTypes.js";
import Tiposkripto from "./BaseTiposkripto.js";

export class WebTiposkripto<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M
> extends Tiposkripto<I, O, M> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
    testResourceRequirement: ITTestResourceRequest,
    testAdapter: Partial<ITestAdapter<I>>,
    webSocketPort: string
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      "3456"
    );
  }

  async receiveTestResourceConfig(
    testResourceConfiguration: Partial<ITTestResourceConfiguration>
  ) {
    const config = JSON.parse(testResourceConfiguration);
    console.log(
      "WebTiposkripto.receiveTestResourceConfig: parsed config:",
      config
    );

    // this is broken
    // return await this.testJobs[0].receiveTestResourceConfig(new PM_Web(config));
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
    const t = new WebTiposkripto<I, O, M>(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      // new URLSearchParams(window.location.search).get("WS_PORT")
      "3456"
    );

    // In a browser environment, the test resource config is passed as a URL query parameter
    // Extract it from the current URL
    // const urlParams = new URLSearchParams(window.location.search);
    // const encodedConfig = urlParams.get('config');
    // const testResourceConfig = encodedConfig ? decodeURIComponent(encodedConfig) : "{}";

    // console.log('Web test: parsed config from URL:', testResourceConfig);

    // const results = await t.receiveTestResourceConfig(testResourceConfig);

    // // In a browser, we can't exit the process, so we need to signal completion differently
    // // Dispatch a custom event to notify the test runner
    // const event = new CustomEvent("test-complete", { detail: results });
    // window.dispatchEvent(event);

    // console.log("Web test completed:", results);

    // Return the Tiposkripto instance
    return t;
  } catch (e) {
    console.error(e);
    // Dispatch an error event
    const errorEvent = new CustomEvent("test-error", { detail: e });
    window.dispatchEvent(errorEvent);
    throw e;
  }
};

export default tiposkripto;
