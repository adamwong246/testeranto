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

// myTests/storefront/beta/index.test.ts
import { assert } from "chai";

// myTests/storefront/beta/index.testeranto.test.ts
import { ethers } from "ethers";
import Ganache from "ganache";
import React from "react";
import renderer, { act } from "react-test-renderer";
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

// myTests/storefront/beta/index.testeranto.test.ts
var reactPropsOfContract = (contract) => __async(void 0, null, function* () {
  return {
    counter: Web3.utils.hexToNumber(yield contract.get({ gasLimit: 15e4 })),
    inc: () => __async(void 0, null, function* () {
      return yield contract.inc({ gasLimit: 15e4 });
    }),
    dec: () => __async(void 0, null, function* () {
      return yield contract.dec({ gasLimit: 15e4 });
    })
  };
});
var StorefrontTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeAll: function(npt) {
      return __async(this, null, function* () {
        const contract = (yield solCompile(npt.contractName)).contracts.find((c) => c.contractName === npt.contractName);
        if (contract) {
          return {
            compiledContract: contract,
            component: npt.component
          };
        } else {
          throw "idk";
        }
      });
    },
    beforeEach: function(subject, props, testResource) {
      return __async(this, null, function* () {
        return new Promise((res) => {
          const options = {};
          const port = testResource.ports[0];
          const server = Ganache.server(options);
          server.listen(port, (err) => __async(this, null, function* () {
            if (err)
              throw err;
            console.log(`ganache listening on port ${port}...`);
            const providerFarSide = server.provider;
            const accounts = yield providerFarSide.request({
              method: "eth_accounts",
              params: []
            });
            const web3NearSide = new Web3(providerFarSide);
            const contractNearSide = yield new web3NearSide.eth.Contract(subject.compiledContract.abi).deploy({
              /* @ts-ignore:next-line */
              data: subject.compiledContract.bytecode.bytes
            }).send({ from: accounts[0], gas: 7e6 });
            const web3FarSideProvider = new ethers.providers.JsonRpcProvider(`http://localhost:${port}`);
            const web3FarSideSigner = new ethers.Wallet(
              providerFarSide.getInitialAccounts()[accounts[1]].secretKey,
              web3FarSideProvider
            );
            const contractFarSide = new ethers.Contract(
              contractNearSide.options.address,
              subject.compiledContract.abi,
              web3FarSideSigner
            );
            let rendereredComponent;
            yield act(() => __async(this, null, function* () {
              rendereredComponent = renderer.create(
                React.createElement(
                  subject.component,
                  yield reactPropsOfContract(contractFarSide),
                  []
                )
              );
            }));
            res({
              contractNearSide,
              contractFarSide,
              accounts,
              server,
              rendereredComponent,
              component: subject.component
            });
          }));
        });
      });
    },
    andWhen: function(store, actioner) {
      return __async(this, null, function* () {
        yield act(() => __async(this, null, function* () {
          yield actioner(store)(store);
          store.rendereredComponent.update(
            React.createElement(
              store.component,
              yield reactPropsOfContract(store.contractFarSide),
              []
            )
          );
        }));
        return store;
      });
    },
    butThen: function(store) {
      return __async(this, null, function* () {
        yield act(() => __async(this, null, function* () {
          store.rendereredComponent.update(
            React.createElement(
              store.component,
              yield reactPropsOfContract(store.contractFarSide),
              []
            )
          );
        }));
        return store;
      });
    },
    afterEach: function(store, ndx, saveTestArtifact) {
      return __async(this, null, function* () {
        yield store.server.close();
      });
    }
  }
);

// src/storefront.tsx
import React2 from "react";
function Storefront({ counter, inc, dec }) {
  return /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("h2", null, "storefront.tsx"), /* @__PURE__ */ React2.createElement("pre", { id: "counter" }, counter), /* @__PURE__ */ React2.createElement("button", { id: "inc", onClick: inc }, " plus one"), /* @__PURE__ */ React2.createElement("button", { id: "dec", onClick: dec }, " minus one"));
}
var storefront_default = Storefront;

// myTests/storefront/beta/index.test.ts
var StorefrontTestBeta = StorefrontTesteranto(
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
      Increment: () => (_0) => __async(void 0, [_0], function* ({ rendereredComponent }) {
        return yield rendereredComponent.root.findByProps({ id: "inc" }).props.onClick();
      }),
      Decrement: () => (_0) => __async(void 0, [_0], function* ({ rendereredComponent }) {
        return yield rendereredComponent.root.findByProps({ id: "dec" }).props.onClick();
      })
    },
    Thens: {
      TheCounterIs: (expectation) => (_0) => __async(void 0, [_0], function* ({ rendereredComponent }) {
        return assert.deepEqual(expectation, rendereredComponent.toTree().rendered.rendered[1].rendered.toString());
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
        "the storefront react app, beta",
        [
          Given.AnEmptyState(
            [`federatedSplitContract`],
            [],
            [
              Then.TheCounterIs("0")
            ]
          ),
          Given.AnEmptyState(
            [],
            [
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment()
            ],
            [
              Then.TheCounterIs("4")
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
              Then.TheCounterIs("6")
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
              Then.TheCounterIs("36")
            ]
          )
        ],
        []
      )
    ];
  },
  {
    contractName: "MyFirstContract",
    component: storefront_default
  }
);
export {
  StorefrontTestBeta
};
