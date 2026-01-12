import {
  defaultTestResourceRequirement,
  ITestResourceConfiguration,
  ITTestResourceRequest,
} from "./index.js";

import {
  Ibdd_in_any,
  Ibdd_out,
  Ibdd_out_any,
  ITestAdapter,
  ITestImplementation,
  ITestSpecification,
} from "../../CoreTypes.js";
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
    testAdapter: Partial<ITestAdapter<I>>
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedConfig = urlParams.get("config");
    const testResourceConfig = encodedConfig
      ? decodeURIComponent(encodedConfig)
      : "{}";

    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      JSON.parse(testResourceConfig)
    );
  }

  async writeFileSync({
    filename,
    payload,
  }: {
    filename: string;
    payload: any;
  }) {
    const root = await navigator.storage.getDirectory();

    // 1. Create (or get) a file handle
    const fileHandle = await root.getFileHandle(filename, { create: true });

    // 2. Create a writable stream
    const writable = await fileHandle.createWritable();

    // 3. Write data (strings, Blobs, or ArrayBuffers)
    await writable.write(JSON.stringify(payload));

    // 4. Close the stream to save changes
    await writable.close();
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
      testAdapter
    );
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
