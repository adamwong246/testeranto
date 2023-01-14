
import { assert } from "chai";
import { features } from "../testerantoFeatures.test";
import { SolidityTesteranto } from "./solidity.testeranto.test";

import { commonGivens } from './index.test';

export const FallenAngelsTesteranto = SolidityTesteranto<
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
  }
>(
  {
    Suites: {
      Default: "FallenAngels.sol"
    },
    Givens: {
      Default: () => {
        return 'FallenAngels.sol';
      }
    },
    Whens: {
      Increment: (asTestUser) => ({ contract, accounts }) => {
        return contract.methods.inc().send({ from: accounts[asTestUser] })
          .on('receipt', function (x) {
            return (x);
          })
      },
      Decrement: (asTestUser) => ({ contract, accounts }) => {
        return new Promise((res) => {
          contract.methods.dec().send({ from: accounts[asTestUser] })
            .then(function (x) {
              res(x)
            })
        });
      },
    },
    Thens: {
      Get: ({ asTestUser, expectation }) => async ({ contract, accounts }) =>
        assert.equal((expectation), parseInt((await contract.methods.get().call())))
    },
    Checks: {
      AnEmptyState: () => 'MyFirstContract.sol',
    },
  },

  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "FallenAngels, ephemerally",
        // this is expected to fail
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
      ),
    ];
  },
  "solSource",
  'FallenAngels'
);
