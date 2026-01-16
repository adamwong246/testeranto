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

const config = {
  name: 'web',
  fs: 'testeranto/reports/allTests/example/Calculator.test/web',
  ports: [1111],
  files: [],
  timeout: 30000,
  retries: 3,
  environment: {}
}
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
      "web",
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      // JSON.parse(testResourceConfig)
      config
    );
  }

  writeFileSync(
    filename: string,
    payload: string,
  ): void {
    // Store files in a global object that can be accessed via Puppeteer
    if (!(window as any).__testeranto_files__) {
      (window as any).__testeranto_files__ = {};
    }
    (window as any).__testeranto_files__[filename] = payload;

    // Also try to use the File System Access API if available
    if (navigator.storage && navigator.storage.getDirectory) {
      (async () => {
        try {
          const root = await navigator.storage.getDirectory();
          const fileHandle = await root.getFileHandle(filename, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(payload);
          await writable.close();
        } catch (e) {
          console.warn('Could not write to browser storage:', e);
        }
      })();
    }
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

    // const data = navigator.storage.
    const root = await navigator.storage.getDirectory();

    // 1. Create (or get) a file handle
    const fileHandle = await root.getFileHandle(`${config.fs}/tests.json`);


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
