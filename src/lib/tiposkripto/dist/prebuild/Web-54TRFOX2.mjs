import {
  BaseTiposkripto
} from "./chunk-57HFMKB2.mjs";
import {
  defaultTestResourceRequirement
} from "./chunk-OO6YKXBX.mjs";

// src/Web.ts
var config = {
  name: "web",
  fs: "testeranto/reports/allTests/example/Calculator.test/web",
  ports: [1111],
  files: [],
  timeout: 3e4,
  retries: 3,
  environment: {}
};
var WebTiposkripto = class extends BaseTiposkripto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedConfig = urlParams.get("config");
    const testResourceConfig = encodedConfig ? decodeURIComponent(encodedConfig) : "{}";
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
  writeFileSync(filename, payload) {
    if (!window.__testeranto_files__) {
      window.__testeranto_files__ = {};
    }
    window.__testeranto_files__[filename] = payload;
    if (navigator.storage && navigator.storage.getDirectory) {
      (async () => {
        try {
          const root = await navigator.storage.getDirectory();
          const fileHandle = await root.getFileHandle(filename, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(payload);
          await writable.close();
        } catch (e) {
          console.warn("Could not write to browser storage:", e);
        }
      })();
    }
  }
};
var tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const t = new WebTiposkripto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter
    );
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(`${config.fs}/tests.json`);
    return t;
  } catch (e) {
    console.error(e);
    const errorEvent = new CustomEvent("test-error", { detail: e });
    window.dispatchEvent(errorEvent);
    throw e;
  }
};
var Web_default = tiposkripto;
export {
  WebTiposkripto,
  Web_default as default
};
