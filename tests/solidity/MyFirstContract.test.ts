
import { assert } from "chai";
import { features } from "../testerantoFeatures.test";
import { SolidityTesteranto } from "./solidity.testeranto.test";

export const MyFirstContractTesteranto = SolidityTesteranto<
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
      Default: "Testing a very simple smart contract"
    },
    Givens: {
      Default: () => {
        return 'MyFirstContract.sol';
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
        "Testing a very simple smart contract",
        [
          Given.Default(
            [features.hello],
            [],
            [
              Then.Get({ asTestUser: 1, expectation: 0 })
            ],
            "my first contract"
          ),

          Given.Default(
            [features.hello],
            [
              When.Increment(1),
              When.Increment(1),
              When.Increment(1),
              When.Increment(1),
            ],
            [
              Then.Get({ asTestUser: 1, expectation: 4 })
            ],
            "my first contract"
          ),

          Given.Default(
            [features.hello],
            [
              When.Increment(1),
              When.Increment(1),
              When.Increment(1),
              When.Increment(1),
              When.Decrement(1),
            ],
            [
              Then.Get({ asTestUser: 1, expectation: 3 })
            ],
            "my first contract"
          ),

          Given.Default(
            [features.hello],
            [
              When.Decrement(1),
              When.Decrement(1),
              When.Decrement(1),
              When.Increment(1),
            ],
            [
              Then.Get({ asTestUser: 1, expectation: 1.157920892373162e+77 })
            ],
            "this test should fail"
          ),
        ],
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
  'MyFirstContract',
  __filename
);
