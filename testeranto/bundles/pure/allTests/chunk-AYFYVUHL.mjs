import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  PM,
  TesterantoCore,
  defaultTestResourceRequirement
} from "./chunk-NZTCDFDL.mjs";

// src/PM/pure.ts
var PM_Pure = class extends PM {
  constructor(t) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }
  getInnerHtml(selector, page) {
    throw new Error("pure.ts getInnHtml not implemented");
    return Promise.resolve("");
  }
  stopSideCar(uid) {
    throw new Error("pure.ts getInnHtml not implemented");
    return Promise.resolve(true);
  }
  start() {
    return new Promise((r) => r());
  }
  stop() {
    return new Promise((r) => r());
  }
  launchSideCar(n) {
    return globalThis["launchSideCar"](n, this.testResourceConfiguration.name);
  }
  pages() {
    return globalThis["pages"]();
  }
  waitForSelector(p, s) {
    return globalThis["waitForSelector"](p, s);
  }
  closePage(p) {
    return globalThis["closePage"](p);
  }
  goto(cdpPage, url) {
    return globalThis["goto"](cdpPage.mainFrame()._id, url);
  }
  newPage() {
    return globalThis["newPage"]();
  }
  $(selector) {
    return globalThis["$"](selector);
  }
  isDisabled(selector) {
    return globalThis["isDisabled"](selector);
  }
  getAttribute(selector, attribute) {
    return globalThis["getAttribute"](selector, attribute);
  }
  getValue(selector) {
    return globalThis["getValue"](selector);
  }
  focusOn(selector) {
    return globalThis["focusOn"](selector);
  }
  typeInto(selector, value) {
    return globalThis["typeInto"](selector, value);
  }
  page() {
    return globalThis["page"]();
  }
  click(selector) {
    return globalThis["click"](selector);
  }
  screencast(opts, page) {
    return globalThis["screencast"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page,
      this.testResourceConfiguration.name
    );
  }
  screencastStop(p) {
    return globalThis["screencastStop"](p);
  }
  customScreenShot(opts, page) {
    return globalThis["customScreenShot"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page,
      this.testResourceConfiguration.name
    );
  }
  existsSync(destFolder) {
    return globalThis["existsSync"](
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }
  mkdirSync() {
    return globalThis["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }
  write(uid, contents) {
    return globalThis["write"](uid, contents);
  }
  writeFileSync(filepath, contents) {
    return globalThis["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }
  createWriteStream(filepath) {
    return globalThis["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }
  end(uid) {
    return globalThis["end"](uid);
  }
  customclose() {
    globalThis["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }
  testArtiFactoryfileWriter(tLog, callback) {
  }
  // startPuppeteer(options?: any): any {
  //   // return puppeteer.connect(options).then((b) => {
  //   //   this.browser = b;
  //   // });
  // }
};

// src/Pure.ts
var PureTesteranto = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      () => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    console.log(
      "[DEBUG] receiveTestResourceConfig called with:",
      partialTestResource
    );
    const t = JSON.parse(partialTestResource);
    const pm = new PM_Pure(t);
    try {
      console.log("[DEBUG] Executing test job with PM:", pm);
      const result = await this.testJobs[0].receiveTestResourceConfig(pm);
      console.log("[DEBUG] Test job completed with result:", result);
      return result;
    } catch (e) {
      console.error("[ERROR] Test job failed:", e);
      return {
        failed: true,
        fails: -1,
        artifacts: [],
        // logPromise: Promise.resolve(),
        features: []
      };
    }
  }
};
var Pure_default = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
  return new PureTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter
  );
};

export {
  Pure_default
};
