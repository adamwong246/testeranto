
import { assert } from "chai";

import { features } from "../features.test.mjs";
import { SolidityTesteranto } from "../myTests/solidity.testeranto.test";

import { IMyFirstContractTestSpecification, commonGivens } from './MyFirstContractGivens.test';

export const MyFirstContractTesteranto = SolidityTesteranto<
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
      Increment: (asTestUser) => ({ contract, accounts }) => {
        return contract.methods.inc().send({ from: accounts[asTestUser] })
          .on('receipt', function (x) {
            return (x);
          })
      },
      Decrement: (asTestUser) => ({ contract, accounts }) => {
        return contract.methods.dec().send({ from: accounts[asTestUser] })
          .on('receipt', function (x) {
            return (x)
          })
      },
    },
    thens: {
      Get: ({ asTestUser, expectation }) => async ({ contract, accounts }) =>
        assert.equal((expectation), parseInt((await contract.methods.get().call())))
    },
    checks: {
      AnEmptyState: () => 'MyFirstContract.sol',
    },
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
      ),
    ];
  },
  ['MyFirstContract', async (web3) => {
    // const accounts = await web3.eth.getAccounts();
    return []
  }]
);
