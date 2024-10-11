
import { assert } from "chai";

import { features } from "../features.test.mjs";
import { SolidityRpcTesteranto } from "../myTests/solidity-rpc.testeranto.test";

import { IMyFirstContractTestSpecification, commonGivens } from './MyFirstContractGivens.test';

export const MyFirstContractPlusRpcTesteranto = SolidityRpcTesteranto<
  IMyFirstContractTestSpecification
>(
  {
    suites: {
      Default: "Testing a very simple smart contract"
    },
    givens: {
      Default: () => {
        return 'MyFirstContract.sol';
      }
    },
    whens: {
      Increment: (asTestUser) => async ({ contractFarSide, accounts }) => {
        return await contractFarSide.inc({ gasLimit: 150000 })
      },
      Decrement: (asTestUser) => async ({ contractFarSide, accounts }) => {
        return await contractFarSide.dec({ gasLimit: 150000 });
      },
    },
    thens: {
      Get: ({ asTestUser, expectation }) => async ({ contractFarSide, accounts }) =>
        assert.equal((expectation), parseInt((await contractFarSide.get({ gasLimit: 150000 }))))
    },
    checks: {
      AnEmptyState: () => 'MyFirstContract.sol',
    },
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
      ),
    ];
  },
  "solSource",
  'MyFirstContract'
);
