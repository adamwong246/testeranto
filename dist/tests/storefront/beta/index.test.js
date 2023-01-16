// tests/storefront/beta/index.test.ts
import { assert } from "chai";

// tests/storefront/beta/index.testeranto.test.ts
import { ethers } from "ethers";
import Ganache from "ganache";
import React from "react";
import renderer, { act } from "react-test-renderer";
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

// tests/storefront/beta/index.testeranto.test.ts
var StorefrontTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeAll: async function(npt) {
      const contract = (await solCompile(npt.contractName)).contracts.find((c) => c.contractName === npt.contractName);
      if (contract) {
        return {
          compiledContract: contract,
          component: npt.component
        };
      } else {
        throw "idk";
      }
    },
    beforeEach: async function(subject, props, testResource) {
      return new Promise((res) => {
        const options = {};
        const port = testResource.ports[0];
        const server = Ganache.server(options);
        server.listen(port, async (err) => {
          if (err)
            throw err;
          console.log(`ganache listening on port ${port}...`);
          const providerFarSide = server.provider;
          const accounts = await providerFarSide.request({
            method: "eth_accounts",
            params: []
          });
          const web3NearSide = new Web3(providerFarSide);
          const contractNearSide = await new web3NearSide.eth.Contract(subject.compiledContract.abi).deploy({
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
          await act(async () => {
            rendereredComponent = renderer.create(
              React.createElement(
                subject.component,
                {
                  counter: ethers.utils.formatEther(await contractFarSide.get({ gasLimit: 15e4 })),
                  inc: async () => await contractFarSide.inc({ gasLimit: 15e4 }),
                  dec: async () => await contractFarSide.dec({ gasLimit: 15e4 })
                },
                []
              )
            );
          });
          res({
            contractNearSide,
            contractFarSide,
            accounts,
            server,
            rendereredComponent,
            component: subject.component
          });
        });
      });
    },
    andWhen: async function(store, actioner) {
      await act(() => actioner()(store));
      await act(async () => {
        store.rendereredComponent.update(
          React.createElement(
            store.component,
            {
              counter: ethers.utils.formatEther(await store.contractFarSide.get({ gasLimit: 15e4 })),
              inc: async () => await store.contractFarSide.inc({ gasLimit: 15e4 }),
              dec: async () => await store.contractFarSide.dec({ gasLimit: 15e4 })
            },
            []
          )
        );
      });
      return store;
    },
    butThen: async function(store) {
      await act(async () => {
        store.rendereredComponent.update(
          React.createElement(
            store.component,
            {
              counter: ethers.utils.formatEther(await store.contractFarSide.get({ gasLimit: 15e4 })),
              inc: async () => await store.contractFarSide.inc({ gasLimit: 15e4 }),
              dec: async () => await store.contractFarSide.dec({ gasLimit: 15e4 })
            },
            []
          )
        );
      });
      return store;
    },
    afterEach: async function(store, ndx, saveTestArtifact) {
      await store.server.close();
    }
  }
);

// src/storefront.tsx
import React2 from "react";
function Storefront({ counter, inc, dec }) {
  return /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("h2", null, "storefront.tsx"), /* @__PURE__ */ React2.createElement("pre", { id: "counter" }, counter), /* @__PURE__ */ React2.createElement("button", { id: "inc", onClick: inc }, " plus one"), /* @__PURE__ */ React2.createElement("button", { id: "dec", onClick: dec }, " minus one"));
}
var storefront_default = Storefront;

// tests/storefront/beta/index.test.ts
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
      Increment: () => async ({ rendereredComponent }) => {
        console.log(rendereredComponent.root.findByProps({ id: "inc" }).props.onClick);
        rendereredComponent.root.findByProps({ id: "inc" }).props.onClick();
      },
      Decrement: () => async ({ rendereredComponent }) => {
        console.log(rendereredComponent.root.findByProps({ id: "dec" }).props.onClick);
        rendereredComponent.root.findByProps({ id: "dec" }).props.onClick();
      }
    },
    Thens: {
      TheCounterIs: (expectation) => async ({ rendereredComponent }) => {
        const compAsJson = rendereredComponent.toTree().rendered.rendered[1].rendered.toString();
        console.log("compAsJson", compAsJson);
        assert.deepEqual(
          1,
          1
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
        "the storefront react app",
        [
          Given.AnEmptyState(
            [],
            [When.Increment()],
            [
              Then.TheCounterIs(1)
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
  StorefrontTest
};
