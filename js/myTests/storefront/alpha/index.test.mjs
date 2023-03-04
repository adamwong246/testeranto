var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// myTests/storefront/alpha/index.test.ts
import { assert } from "chai";

// myTests/storefront/alpha/index.testeranto.test.ts
import puppeteer from "puppeteer";
import esbuild from "esbuild";
import Ganache from "ganache";
import Web3 from "web3";
import { Testeranto } from "testeranto";

// myTests/solidity/truffle.mts
import fs from "fs/promises";
import path from "path";
import { Compile } from "@truffle/compile-solidity";
import TruffleConfig from "@truffle/config";
var buildFullPath = (parent, path2) => {
  let curDir = parent.substr(0, parent.lastIndexOf("/"));
  if (path2.startsWith("@")) {
    return process.cwd() + "/node_modules/" + path2;
  }
  if (path2.startsWith("./")) {
    return curDir + "/" + path2.substr(2);
  }
  while (path2.startsWith("../")) {
    curDir = curDir.substr(0, curDir.lastIndexOf("/"));
    path2 = path2.substr(3);
  }
  return curDir + "/" + path2;
};
var solidifier = (_0, ..._1) => __async(void 0, [_0, ..._1], function* (path2, recursivePayload = {}) {
  const text = (yield fs.readFile(path2)).toString();
  const importLines = text.split("\n").filter((line, index, arr) => {
    return index !== arr.length - 1 && line !== "" && line.trim().startsWith("import") === true;
  }).map((line) => {
    const relativePathsplit = line.split(" ");
    return buildFullPath(path2, relativePathsplit[relativePathsplit.length - 1].trim().slice(1, -2));
  });
  for (const importLine of importLines) {
    recursivePayload = __spreadValues(__spreadValues({}, recursivePayload), yield solidifier(importLine));
  }
  recursivePayload[path2] = text;
  return recursivePayload;
});
var solCompile = (entrySolidityFile) => __async(void 0, null, function* () {
  const sources = yield solidifier(process.cwd() + `/contracts/${entrySolidityFile}.sol`);
  const remmapedSources = {};
  for (const filepath of Object.keys(sources)) {
    const x = filepath.split(process.cwd() + "/contracts/");
    if (x.length === 1) {
      remmapedSources[filepath.split(process.cwd() + "/node_modules/")[1]] = sources[filepath];
    } else {
      remmapedSources[filepath] = sources[filepath];
    }
  }
  const tConfig = new TruffleConfig();
  const options = TruffleConfig.load(path.resolve(process.cwd(), `truffle-config.cjs`));
  return yield Compile.sources({
    sources: remmapedSources,
    options
  });
});

// myTests/storefront/alpha/index.testeranto.test.ts
var StorefrontTesteranto = (testImplementations, testSpecifications, testInput, contractName) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeAll: function(_0) {
      return __async(this, arguments, function* ([bundlePath, htmlTemplate]) {
        return {
          contract: (yield solCompile(contractName)).contracts.find((c) => c.contractName === contractName),
          browser: yield puppeteer.launch({
            headless: true,
            executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          }),
          htmlBundle: htmlTemplate(
            esbuild.buildSync({
              entryPoints: [bundlePath],
              bundle: true,
              minify: false,
              format: "esm",
              target: ["esnext"],
              write: false
            }).outputFiles[0].text
          )
        };
      });
    },
    beforeEach: function(subject) {
      return __async(this, null, function* () {
        const subjectContract = subject.contract;
        const page = yield subject.browser.newPage();
        const provider = Ganache.provider({
          seed: "drizzle-utils",
          gasPrice: 7e6
        });
        const web3 = new Web3(provider);
        const accounts = yield web3.eth.getAccounts();
        const contract = yield yield new web3.eth.Contract(subjectContract.abi).deploy({ data: subjectContract.bytecode.bytes }).send({ from: accounts[0], gas: 7e6 });
        page.exposeFunction("AppInc", (x) => {
          contract.methods.inc().send({ from: accounts[1] });
        });
        page.exposeFunction("AppDec", (x) => {
          contract.methods.dec().send({ from: accounts[1] });
        });
        return new Promise((res) => __async(this, null, function* () {
          page.exposeFunction("AppBooted", (x) => __async(this, null, function* () {
            page.evaluate((gotten) => {
              document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: gotten }));
            }, yield contract.methods.get().call());
            res({
              page,
              contract,
              accounts,
              provider
            });
          }));
          yield page.waitForTimeout(10);
          page.setContent(subject.htmlBundle);
        }));
      });
    },
    andWhen: function(_0, _1) {
      return __async(this, arguments, function* ({ page, contract, accounts }, actioner) {
        const action = yield actioner()({ page });
        yield page.waitForTimeout(10);
        yield page.evaluate((counter) => {
          document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: counter }));
        }, yield contract.methods.get().call());
        return action;
      });
    },
    butThen: function(_0) {
      return __async(this, arguments, function* ({ page, contract }) {
        yield page.waitForTimeout(10);
        yield page.evaluate((counter) => {
          document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: counter }));
        }, yield contract.methods.get().call());
        return { page };
      });
    },
    afterEach: function(_0, _1, _2) {
      return __async(this, arguments, function* ({ page, contract }, ndx, saveTestArtifact) {
        yield page.evaluate((counter) => {
          document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: counter }));
        }, yield contract.methods.get().call());
        saveTestArtifact.png(
          yield (yield page).screenshot()
        );
        return { page };
      });
    }
  }
);

// src/storefront.tsx
import React from "react";
function Storefront({ counter, inc, dec }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "storefront.tsx"), /* @__PURE__ */ React.createElement("pre", { id: "counter" }, counter), /* @__PURE__ */ React.createElement("button", { id: "inc", onClick: inc }, " plus one"), /* @__PURE__ */ React.createElement("button", { id: "dec", onClick: dec }, " minus one"));
}
var storefront_default = Storefront;

// myTests/storefront/alpha/index.test.ts
var StorefrontTest = StorefrontTesteranto(
  {
    Suites: {
      Default: "default storefront suite?"
    },
    Givens: {
      AnEmptyState: () => {
        return;
      }
    },
    Whens: {
      Increment: () => (_0) => __async(void 0, [_0], function* ({ page }) {
        yield page.click("#inc");
      }),
      Decrement: () => (_0) => __async(void 0, [_0], function* ({ page }) {
        return yield page.click("#dec");
      })
    },
    Thens: {
      TheCounterIs: (expectation) => (_0) => __async(void 0, [_0], function* ({ page }) {
        assert.deepEqual(
          yield page.$eval("#counter", (el) => el.innerHTML),
          JSON.stringify(expectation)
        );
      })
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "the storefront react app, alpha",
        [
          Given.AnEmptyState(
            [`federatedSplitContract`],
            [],
            [
              Then.TheCounterIs(0)
            ]
          ),
          Given.AnEmptyState(
            [],
            [When.Increment()],
            [
              Then.TheCounterIs(1)
            ]
          ),
          Given.AnEmptyState(
            [],
            [
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment()
            ],
            [
              Then.TheCounterIs(6)
            ]
          ),
          Given.AnEmptyState(
            [],
            [
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment()
            ],
            [
              Then.TheCounterIs(36)
            ]
          )
        ],
        []
      )
    ];
  },
  [
    "./myTests/storefront/alpha/testIndex.test.tsx",
    (jsbundle) => `
            <!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module">${jsbundle}<\/script>
    </head>

    <body>
      <div id="root">
        <p>loading...</p>
      </div>
    </body>

    <footer></footer>

    </html>
`,
    storefront_default
  ],
  "MyFirstContract"
);
export {
  StorefrontTest
};
