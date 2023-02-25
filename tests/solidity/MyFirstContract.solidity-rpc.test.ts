
import { assert } from "chai";
import { features } from "../testerantoFeatures.test";
import { SolidityRpcTesteranto } from "./solidity-rpc.testeranto.test";

import { commonGivens } from './index.test';

export const MyFirstContractPlusRpcTesteranto = SolidityRpcTesteranto<
  {
    suites: {
      Default;
    };
    givens: {
      Default;
    };
    whens: {
      Increment: [number];
      Decrement: [number];
    };
    thens: {
      Get: [{ asTestUser: number, expectation: number }];
    };
    checks: {
      AnEmptyState: [];
    };
  },
  typeof features
>(
  {
    Suites: {
      Default: "Testing a very simple smart contract"
    },
    Givens: {
      Default: () => {
        return 'MyFirstContract.sol';
      }
    },
    Whens: {
      Increment: (asTestUser) => async ({ contractFarSide, accounts }) => {
        return await contractFarSide.inc({ gasLimit: 150000 })
      },
      Decrement: (asTestUser) => async ({ contractFarSide, accounts }) => {
        return await contractFarSide.dec({ gasLimit: 150000 });
      },
    },
    Thens: {
      Get: ({ asTestUser, expectation }) => async ({ contractFarSide, accounts }) =>
        assert.equal((expectation), parseInt((await contractFarSide.get({ gasLimit: 150000 }))))
    },
    Checks: {
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
