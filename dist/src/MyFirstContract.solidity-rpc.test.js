"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/MyFirstContract.solidity-rpc.test.ts
var MyFirstContract_solidity_rpc_test_exports = {};
__export(MyFirstContract_solidity_rpc_test_exports, {
  MyFirstContractPlusRpcTesteranto: () => MyFirstContractPlusRpcTesteranto
});
module.exports = __toCommonJS(MyFirstContract_solidity_rpc_test_exports);
var import_chai = require("chai");

// features.test.mts
var import_Features = require("testeranto/src/Features");
var MyFeature = class extends import_Features.BaseFeature {
  constructor(name, due) {
    super(name);
    this.due = due;
  }
};
var features = {
  root: new MyFeature("kokomo bay"),
  mint: new MyFeature("An ERC721 which is redeemable?!!!"),
  redemption: new MyFeature(
    "Redeems an ERC-721, marking its state as redeemed"
  ),
  federatedSplitContract: new MyFeature(
    "A website which can acts as a storefront"
  ),
  markRedeemed: new MyFeature(
    "Registers contract status as redeemed, and changes image"
  ),
  encryptShipping: new MyFeature(
    "Buyer encrypts plaintext message and stores value on contract"
  ),
  decryptShipping: new MyFeature("Vendor Decrypts plaintext message"),
  buildSilo: new MyFeature(
    "build the rocket silo",
    /* @__PURE__ */ new Date("2023-05-02T02:36:34+0000")
  ),
  buildRocket: new MyFeature(
    "build the rocket",
    /* @__PURE__ */ new Date("2023-06-06T02:36:34+0000")
  ),
  buildSatellite: new MyFeature(
    "build the rocket payload",
    /* @__PURE__ */ new Date("2023-06-06T02:36:34+0000")
  ),
  hello: new MyFeature("hello"),
  aloha: new MyFeature("aloha"),
  gutentag: new MyFeature("gutentag"),
  buenosDias: new MyFeature("buenos dias"),
  hola: new MyFeature("hola"),
  bienVenidos: new MyFeature("bien venidos"),
  walkingTheDog: new MyFeature("my favorite chore")
};
var priorityGraph = new import_Features.TesterantoGraphDirectedAcyclic("Priority");
priorityGraph.connect(`root`, `redemption`);
priorityGraph.connect(`root`, `federatedSplitContract`);
priorityGraph.connect(`root`, `mint`);
priorityGraph.connect(`redemption`, `markRedeemed`);
priorityGraph.connect(`redemption`, `encryptShipping`);
priorityGraph.connect(`redemption`, `decryptShipping`);
var semantic = new import_Features.TesterantoGraphDirected("some semantic directed graph");
semantic.connect(`hello`, `aloha`, "superceedes");
semantic.connect(`gutentag`, `hola`, "negates");
var undirected = new import_Features.TesterantoGraphUndirected(
  "an undirected semantic graph"
);
undirected.connect(`gutentag`, `aloha`, "related");
undirected.connect(`buildRocket`, `buildSatellite`, "overlap");
undirected.connect(`buildRocket`, `buildSilo`, "overlap");
var features_test_default = new import_Features.TesterantoFeatures(features, {
  undirected: [undirected],
  directed: [semantic],
  dags: [priorityGraph]
});

// myTests/solidity-rpc.testeranto.test.ts
var import_ganache = __toESM(require("ganache"), 1);
var import_web3 = __toESM(require("web3"), 1);
var import_ethers = require("ethers");
var import_core_node = __toESM(require("testeranto/src/core-node"), 1);

// myTests/truffle.mts
var import_promises = __toESM(require("fs/promises"), 1);
var import_path = __toESM(require("path"), 1);
var import_compile_solidity = require("@truffle/compile-solidity");
var import_config = __toESM(require("@truffle/config"), 1);
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
  const text = (await import_promises.default.readFile(path2)).toString();
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
  const tConfig = new import_config.default();
  const options = import_config.default.load(import_path.default.resolve(process.cwd(), `truffle-config.cjs`));
  return await import_compile_solidity.Compile.sources({
    sources: remmapedSources,
    options
  });
};

// myTests/solidity-rpc.testeranto.test.ts
var SolidityRpcTesteranto = (testImplementations, testSpecifications, testInput, contractName) => (0, import_core_node.default)(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeAll: async () => (await solCompile(contractName)).contracts.find((c) => c.contractName === contractName),
    beforeEach: (contract, i, tr) => {
      return new Promise((res) => {
        const options = {};
        const port = tr.ports[0];
        const server = import_ganache.default.server(options);
        server.listen(port, async (err) => {
          console.log(`ganache listening on port ${port}...`);
          if (err)
            throw err;
          const providerFarSide = server.provider;
          const accounts = await providerFarSide.request({ method: "eth_accounts", params: [] });
          const web3NearSide = new import_web3.default(providerFarSide);
          const contractNearSide = await new web3NearSide.eth.Contract(contract.abi).deploy({ data: contract.bytecode.bytes }).send({ from: accounts[0], gas: 7e6 });
          const web3FarSideProvider = new import_ethers.ethers.providers.JsonRpcProvider(`http://localhost:${port}`);
          const web3FarSideSigner = new import_ethers.ethers.Wallet(
            providerFarSide.getInitialAccounts()[accounts[1]].secretKey,
            web3FarSideProvider
          );
          const contractFarSide = new import_ethers.ethers.Contract(
            contractNearSide.options.address,
            contract.abi,
            web3FarSideSigner
          );
          res({
            contractNearSide,
            contractFarSide,
            accounts,
            server
          });
        });
      });
    },
    afterEach: async ({ server }) => await server.close(),
    andWhen: async ({ contractFarSide, accounts }, callback) => callback()({ contractFarSide, accounts })
  },
  { ports: 1 }
);

// src/MyFirstContractGivens.test.ts
var commonGivens = (Given, When, Then, features2) => {
  return {
    "test0": Given.Default(
      [`hello`],
      [],
      [
        Then.Get({ asTestUser: 1, expectation: 0 })
      ],
      "my first contract"
    ),
    "test1": Given.Default(
      [`hello`],
      [
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1)
      ],
      [
        Then.Get({ asTestUser: 1, expectation: 4 })
      ],
      "my first contract"
    ),
    "test2": Given.Default(
      [`hello`],
      [
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Decrement(1)
      ],
      [
        Then.Get({ asTestUser: 1, expectation: 3 })
      ],
      "my first contract"
    )
    // "test3": Given.Default(
    //   [`hello`],
    //   [
    //     When.Decrement(1),
    //     When.Decrement(1),
    //     When.Decrement(1),
    //     When.Increment(1),
    //     When.Increment(1),
    //   ],
    //   [
    //     Then.Get({ asTestUser: 1, expectation: 1.157920892373162e+77 })
    //   ],
    //   "this test should fail"
    // )
  };
};

// src/MyFirstContract.solidity-rpc.test.ts
var MyFirstContractPlusRpcTesteranto = SolidityRpcTesteranto(
  {
    Suites: {
      Default: "Testing a very simple smart contract"
    },
    Givens: {
      Default: () => {
        return "MyFirstContract.sol";
      }
    },
    Whens: {
      Increment: (asTestUser) => async ({ contractFarSide, accounts }) => {
        return await contractFarSide.inc({ gasLimit: 15e4 });
      },
      Decrement: (asTestUser) => async ({ contractFarSide, accounts }) => {
        return await contractFarSide.dec({ gasLimit: 15e4 });
      }
    },
    Thens: {
      Get: ({ asTestUser, expectation }) => async ({ contractFarSide, accounts }) => import_chai.assert.equal(expectation, parseInt(await contractFarSide.get({ gasLimit: 15e4 })))
    },
    Checks: {
      AnEmptyState: () => "MyFirstContract.sol"
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing a very simple smart contract over RPC",
        commonGivens(Given, When, Then, features),
        [
          // Check.AnEmptyState(
          //   "imperative style",
          //   [`aloha`],
          //   async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
          //     await TheEmailIsSetTo("foo");
          //     await TheEmailIs("foo");
          //     const reduxPayload = await TheEmailIsSetTo("foobar");
          //     await TheEmailIs("foobar");
          //     // assert.deepEqual(reduxPayload, {
          //     //   type: "login app/setEmail",
          //     //   payload: "foobar",
          //     // });
          //   }
          // ),
        ]
      )
    ];
  },
  "solSource",
  "MyFirstContract"
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MyFirstContractPlusRpcTesteranto
});
