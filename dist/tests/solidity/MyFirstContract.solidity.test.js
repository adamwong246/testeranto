// tests/solidity/MyFirstContract.solidity.test.ts
import { assert } from "chai";
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";

// tests/solidity/solidity.testeranto.test.ts
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
  const options = TruffleConfig.detect();
  console.log("solc settings", options._values.compilers.solc.settings);
  return await Compile.sources({
    sources: remmapedSources,
    options
  });
};

// tests/solidity/solidity.testeranto.test.ts
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

// tests/solidity/index.test.ts
var commonGivens = (Given, When, Then, features2) => [
  Given.Default(
    [features2.hello],
    [],
    [
      Then.Get({ asTestUser: 1, expectation: 0 })
    ],
    "my first contract"
  ),
  Given.Default(
    [features2.hello],
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
    [features2.hello],
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
  //   [features.hello],
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

// tests/solidity/MyFirstContract.solidity.test.ts
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
          //   [features.aloha],
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
