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

// myTests/storefront/alpha/index.test.ts
import { assert } from "chai";

// myTests/storefront/alpha/index.testeranto.test.ts
import { PassThrough } from "stream";
import puppeteer from "puppeteer";
import esbuild from "esbuild";
import Ganache from "ganache";
import Web3 from "web3";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import Testeranto from "testeranto";

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
var solidifier = async (path2, recursivePayload = {}) => {
  const text = (await fs.readFile(path2)).toString();
  const importLines = text.split("\n").filter((line, index, arr) => {
    return index !== arr.length - 1 && line !== "" && line.trim().startsWith("import") === true;
  }).map((line) => {
    const relativePathsplit = line.split(" ");
    return buildFullPath(path2, relativePathsplit[relativePathsplit.length - 1].trim().slice(1, -2));
  });
  for (const importLine of importLines) {
    recursivePayload = __spreadValues(__spreadValues({}, recursivePayload), await solidifier(importLine));
  }
  recursivePayload[path2] = text;
  return recursivePayload;
};
var solCompile = async (entrySolidityFile) => {
  const sources = await solidifier(process.cwd() + `/contracts/${entrySolidityFile}.sol`);
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
  return await Compile.sources({
    sources: remmapedSources,
    options
  });
};

// myTests/storefront/alpha/index.testeranto.test.ts
var StorefrontTesteranto = (testImplementations, testSpecifications, testInput, contractName, testName) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeAll: async function([bundlePath, htmlTemplate]) {
      return {
        contract: (await solCompile(contractName)).contracts.find((c) => c.contractName === contractName),
        browser: await puppeteer.launch({
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
    },
    beforeEach: async function(subject, ndx, testResource, artifacter) {
      const subjectContract = subject.contract;
      const page = await subject.browser.newPage();
      const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: false,
        fps: 25,
        videoFrame: {
          width: 1024,
          height: 768
        },
        videoCrf: 18,
        videoCodec: "libx264",
        videoPreset: "ultrafast",
        videoBitrate: 1e3,
        autopad: {
          color: "black"
        },
        aspectRatio: "4:3"
      });
      const pipeStream = new PassThrough();
      artifacter("./screencap.mp4", pipeStream);
      await recorder.startStream(pipeStream);
      const provider = Ganache.provider({
        seed: "drizzle-utils",
        gasPrice: 7e6
      });
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const contract = await await new web3.eth.Contract(subjectContract.abi).deploy({ data: subjectContract.bytecode.bytes }).send({ from: accounts[0], gas: 7e6 });
      page.exposeFunction("AppInc", (x) => {
        contract.methods.inc().send({ from: accounts[1] });
      });
      page.exposeFunction("AppDec", (x) => {
        contract.methods.dec().send({ from: accounts[1] });
      });
      return new Promise(async (res) => {
        page.exposeFunction("AppBooted", async (x) => {
          page.evaluate((gotten) => {
            document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: gotten }));
          }, await contract.methods.get().call());
          res({
            page,
            contract,
            accounts,
            provider,
            recorder
          });
        });
        await page.waitForTimeout(10);
        page.setContent(subject.htmlBundle);
      });
    },
    andWhen: async function({ page, contract, accounts }, actioner) {
      const action = await actioner()({ page });
      await page.waitForTimeout(10);
      await page.evaluate((counter) => {
        document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: counter }));
      }, await contract.methods.get().call());
      return action;
    },
    butThen: async function({ page, contract }) {
      await page.waitForTimeout(10);
      await page.evaluate((counter) => {
        document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: counter }));
      }, await contract.methods.get().call());
      return { page };
    },
    afterEach: async function({ page, contract, recorder }, ndx, artifacter) {
      recorder.stop();
      await page.evaluate((counter) => {
        document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: counter }));
      }, await contract.methods.get().call());
      artifacter("screenshotr.png", await (await page).screenshot());
      return { page };
    }
  },
  testName
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
      Increment: () => async ({ page }) => {
        await page.click("#inc");
      },
      Decrement: () => async ({ page }) => await page.click("#dec")
    },
    Thens: {
      TheCounterIs: (expectation) => async ({ page }) => {
        assert.deepEqual(
          await page.$eval("#counter", (el) => el.innerHTML),
          JSON.stringify(expectation)
        );
      }
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
      <script type="module">${jsbundle}</script>
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
  "MyFirstContract",
  "MyFirstContract-storefront-alpha"
);
export {
  StorefrontTest
};
