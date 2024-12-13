import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  MyFirstContractTestInput,
  MyFirstContract_default,
  commonGivens,
  features,
  require_lib15 as require_lib
} from "../chunk-JNJ2P3OP.mjs";
import {
  Node_default
} from "../chunk-OLFHG55Q.mjs";
import {
  assert
} from "../chunk-MSVTAS6Q.mjs";
import "../chunk-Z577W6FW.mjs";
import "../chunk-CTKBT5JH.mjs";
import "../chunk-RBWPBMY4.mjs";
import "../chunk-PJC2V65J.mjs";
import "../chunk-VDOS7AVZ.mjs";
import "../chunk-FLSG3ZVV.mjs";
import {
  __toESM,
  init_cjs_shim
} from "../chunk-THMF2HPO.mjs";

// src/MyFirstContract.basic.test.ts
init_cjs_shim();

// subPackages/solidity/Contract.testeranto.test.ts
init_cjs_shim();
var import_web3 = __toESM(require_lib(), 1);
import Ganache from "ganache";
var Contract_testeranto_test_default = (testImplementations, testSpecifications, testInput) => {
  const compilation = testInput[0];
  return Node_default(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async () => testInput[0],
      beforeEach: async (contract) => {
        const provider = Ganache.provider();
        const web3 = new import_web3.default(provider);
        const accounts = await web3.eth.getAccounts();
        const argz = await testInput[1](web3);
        const size = Buffer.byteLength(contract.deployedBytecode.bytes, "utf8") / 2;
        return {
          contract: await new web3.eth.Contract(contract.abi).deploy({
            data: contract.bytecode.bytes,
            arguments: argz
          }).send({ from: accounts[0], gas: 7e6 }),
          accounts,
          provider
        };
      },
      andWhen: async ({ provider, contract, accounts }, callback) => callback({ contract, accounts })
    }
    // { ports: 0 }
  );
};

// src/MyFirstContract.basic.test.ts
var testImplementation = {
  suites: {
    Default: "Testing a very simple smart contract"
  },
  givens: {
    Default: (x) => x
  },
  whens: {
    Increment: (asTestUser) => ({ contract, accounts }) => {
      return contract.methods.inc().send({ from: accounts[asTestUser] }).on("receipt", function(x) {
        return x;
      });
    },
    Decrement: (asTestUser) => ({ contract, accounts }) => {
      return contract.methods.dec().send({ from: accounts[asTestUser] }).on("receipt", function(x) {
        return x;
      });
    }
  },
  thens: {
    Get: ({ asTestUser, expectation }) => async ({ contract, accounts }) => assert.equal(
      expectation,
      parseInt(await contract.methods.get().call())
    )
  },
  checks: {
    AnEmptyState: () => MyFirstContract_default
  }
};
var MyFirstContract_basic_test_default = Contract_testeranto_test_default(
  testImplementation,
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
  [
    MyFirstContractTestInput,
    async (web3) => {
      return [];
    }
  ]
);
export {
  MyFirstContract_basic_test_default as default
};
