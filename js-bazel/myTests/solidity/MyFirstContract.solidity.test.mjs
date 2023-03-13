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

// myTests/solidity/MyFirstContract.solidity.test.ts
import { assert } from "chai";

// myTests/testerantoFeatures.test.mts
import {
  BaseFeature,
  TesterantoFeatures,
  TesterantoGraphDirected,
  TesterantoGraphDirectedAcyclic,
  TesterantoGraphUndirected
} from "testeranto/src/Features";
var MyFeature = class extends BaseFeature {
  constructor(name, due) {
    super(name);
    this.due = due;
  }
};
var features = {
  root: new MyFeature("kokomo bay"),
  mint: new MyFeature("An ERC721 which is redeemable?!!!"),
  redemption: new MyFeature("Redeems an ERC-721, marking its state as redeemed"),
  federatedSplitContract: new MyFeature("A website which can acts as a storefront"),
  markRedeemed: new MyFeature("Registers contract status as redeemed, and changes image"),
  encryptShipping: new MyFeature("Buyer encrypts plaintext message and stores value on contract"),
  decryptShipping: new MyFeature("Vendor Decrypts plaintext message"),
  buildSilo: new MyFeature("build the rocket silo", /* @__PURE__ */ new Date("2023-05-02T02:36:34+0000")),
  buildRocket: new MyFeature("build the rocket", /* @__PURE__ */ new Date("2023-06-06T02:36:34+0000")),
  buildSatellite: new MyFeature("build the rocket payload", /* @__PURE__ */ new Date("2023-06-06T02:36:34+0000")),
  hello: new MyFeature("hello"),
  aloha: new MyFeature("aloha"),
  gutentag: new MyFeature("gutentag"),
  buenosDias: new MyFeature("buenos dias"),
  hola: new MyFeature("hola"),
  bienVenidos: new MyFeature("bien venidos"),
  walkingTheDog: new MyFeature("my favorite chore")
};
var priorityGraph = new TesterantoGraphDirectedAcyclic("Priority");
priorityGraph.connect(`root`, `redemption`);
priorityGraph.connect(`root`, `federatedSplitContract`);
priorityGraph.connect(`root`, `mint`);
priorityGraph.connect(`redemption`, `markRedeemed`);
priorityGraph.connect(`redemption`, `encryptShipping`);
priorityGraph.connect(`redemption`, `decryptShipping`);
var semantic = new TesterantoGraphDirected("some semantic directed graph");
semantic.connect(`hello`, `aloha`, "superceedes");
semantic.connect(`gutentag`, `hola`, "negates");
var undirected = new TesterantoGraphUndirected("an undirected semantic graph");
undirected.connect(`gutentag`, `aloha`, "related");
undirected.connect(`buildRocket`, `buildSatellite`, "overlap");
undirected.connect(`buildRocket`, `buildSilo`, "overlap");
var testerantoFeatures_test_default = new TesterantoFeatures(
  features,
  {
    undirected: [
      undirected
    ],
    directed: [
      semantic
    ],
    dags: [
      priorityGraph
    ]
  }
);

// myTests/solidity/solidity.testeranto.test.ts
import Ganache from "ganache";
import Web3 from "web3";
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

// myTests/solidity/solidity.testeranto.test.ts
var SolidityTesteranto = async (testImplementations, testSpecifications, testInput) => {
  const compilation = (await solCompile(testInput[0])).contracts.find((c) => c.contractName === testInput[0]);
  return Testeranto(
    testInput,
    testSpecifications,
    testImplementations,
    { ports: 0 },
    {
      beforeAll: async () => compilation,
      beforeEach: async (contract) => {
        const provider = Ganache.provider({
          seed: "drizzle-utils",
          gasPrice: 7e6
        });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const argz = await testInput[1](web3);
        const size = Buffer.byteLength(contract.deployedBytecode.bytes, "utf8") / 2;
        console.log("contract size is", size);
        return {
          contract: await new web3.eth.Contract(contract.abi).deploy({
            data: contract.bytecode.bytes,
            arguments: argz
          }).send({ from: accounts[0], gas: 7e6 }),
          accounts,
          provider
        };
      },
      andWhen: async ({ provider, contract, accounts }, callback) => callback()({ contract, accounts })
    }
  );
};

// myTests/solidity/index.test.ts
var commonGivens = (Given, When, Then, features2) => [
  Given.Default(
    [`hello`],
    [],
    [
      Then.Get({ asTestUser: 1, expectation: 0 })
    ],
    "my first contract"
  ),
  Given.Default(
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
  Given.Default(
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
  // Given.Default(
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
  // ),
];

// myTests/solidity/MyFirstContract.solidity.test.ts
var MyFirstContractTesteranto = SolidityTesteranto(
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
      Increment: (asTestUser) => ({ contract, accounts }) => {
        return contract.methods.inc().send({ from: accounts[asTestUser] }).on("receipt", function(x) {
          return x;
        });
      },
      Decrement: (asTestUser) => ({ contract, accounts }) => {
        return new Promise((res) => {
          contract.methods.dec().send({ from: accounts[asTestUser] }).then(function(x) {
            res(x);
          });
        });
      }
    },
    Thens: {
      Get: ({ asTestUser, expectation }) => async ({ contract, accounts }) => assert.equal(expectation, parseInt(await contract.methods.get().call()))
    },
    Checks: {
      AnEmptyState: () => "MyFirstContract.sol"
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing a very simple smart contract ephemerally",
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
  ["MyFirstContract", async (web3) => {
    return [];
  }]
  // 'MyFirstContract'
);
export {
  MyFirstContractTesteranto
};
