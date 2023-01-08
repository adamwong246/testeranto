// tests/solidity/MyFirstContract.solidity.test.ts
import { assert } from "chai";
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";

// tests/solidity/solidity.testeranto.test.ts
import fs from "fs";
import path from "path";
import Ganache from "ganache";
import TruffleCompile from "truffle-compile";
import Web3 from "web3";
import { Testeranto } from "testeranto";
var truffleCompile = (...args) => new Promise((resolve) => TruffleCompile(...args, (_, data) => resolve(data)));
var compile = async (filename) => {
  const sourcePath = path.join(__dirname, "../contracts", filename);
  const sources = {
    [sourcePath]: fs.readFileSync(sourcePath, { encoding: "utf8" })
  };
  const options = {
    contracts_directory: path.join(__dirname, "../contracts"),
    compilers: {
      solc: {
        version: "0.5.2",
        settings: {
          optimizer: {
            enabled: false,
            runs: 200
          },
          evmVersion: "byzantium"
        }
      }
    }
  };
  const artifact = await truffleCompile(sources, options);
  return artifact;
};
var SolidityTesteranto = (testImplementations, testSpecifications, testInput, contractName) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeAll: async () => {
      return (await compile(`../../../contracts/${contractName}.sol`))[contractName];
    },
    beforeEach: async (contract) => {
      const provider = Ganache.provider({ seed: "drizzle-utils" });
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      return {
        contract: await new web3.eth.Contract(contract.abi).deploy({ data: contract.bytecode }).send({ from: accounts[0], gas: 15e4 }),
        accounts,
        provider
      };
    },
    andWhen: async ({ provider, contract, accounts }, callback) => callback()({ contract, accounts })
  }
);

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
  ),
  Given.Default(
    [features2.hello],
    [
      When.Decrement(1),
      When.Decrement(1),
      When.Decrement(1),
      When.Increment(1),
      When.Increment(1)
    ],
    [
      Then.Get({ asTestUser: 1, expectation: 1157920892373162e62 })
    ],
    "this test should fail"
  )
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
        []
      )
    ];
  },
  "solSource",
  "MyFirstContract"
);
export {
  MyFirstContractTesteranto
};
