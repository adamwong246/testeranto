// tests/storefront/alpha/index.test.ts
import { assert } from "chai";
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";

// tests/storefront/alpha/index.testeranto.test.ts
import puppeteer from "puppeteer";
import esbuild from "esbuild";
import Ganache from "ganache";
import Web3 from "web3";
import { Testeranto } from "testeranto";

// tests/solidity/truffle.ts
import fs from "fs/promises";
import { Compile } from "@truffle/compile-solidity";
import TruffleConfig from "@truffle/config";
var buildFullPath = (parent, path) => {
  let curDir = parent.substr(0, parent.lastIndexOf("/"));
  if (path.startsWith("@")) {
    return process.cwd() + "/node_modules/" + path;
  }
  if (path.startsWith("./")) {
    return curDir + "/" + path.substr(2);
  }
  while (path.startsWith("../")) {
    curDir = curDir.substr(0, curDir.lastIndexOf("/"));
    path = path.substr(3);
  }
  return curDir + "/" + path;
};
var solidifier = async (path, recursivePayload = {}) => {
  const text = (await fs.readFile(path)).toString();
  const importLines = text.split("\n").filter((line, index, arr) => {
    return index !== arr.length - 1 && line !== "" && line.trim().startsWith("import") === true;
  }).map((line) => {
    const relativePathsplit = line.split(" ");
    return buildFullPath(path, relativePathsplit[relativePathsplit.length - 1].trim().slice(1, -2));
  });
  for (const importLine of importLines) {
    recursivePayload = {
      ...recursivePayload,
      ...await solidifier(importLine)
    };
  }
  recursivePayload[path] = text;
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
  return await Compile.sources({ sources: remmapedSources, options: TruffleConfig.detect() });
};

// tests/storefront/alpha/index.testeranto.test.ts
var StorefrontTesteranto = (testImplementations, testSpecifications, testInput, contractName) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
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
    beforeEach: async function(subject) {
      const subjectContract = subject.contract;
      const page = await subject.browser.newPage();
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
            provider
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
    afterEach: async function({ page, contract }, ndx, saveTestArtifact) {
      await page.evaluate((counter) => {
        document.dispatchEvent(new CustomEvent("setCounterEvent", { detail: counter }));
      }, await contract.methods.get().call());
      saveTestArtifact.png(
        await (await page).screenshot()
      );
      return { page };
    }
  }
);

// src/storefront.tsx
import React from "react";
function Storefront({ counter, inc, dec }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "storefront.tsx"), /* @__PURE__ */ React.createElement("pre", { id: "counter" }, counter), /* @__PURE__ */ React.createElement("button", { id: "inc", onClick: inc }, " plus one"), /* @__PURE__ */ React.createElement("button", { id: "dec", onClick: dec }, " minus one"));
}
var storefront_default = Storefront;

// tests/storefront/alpha/index.test.ts
var StorefrontTest = StorefrontTesteranto(
  {
    Suites: {
      Default: "default storefront suite"
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
            [features.federatedSplitContract],
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
    "./tests/storefront/alpha/testIndex.test.tsx",
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
