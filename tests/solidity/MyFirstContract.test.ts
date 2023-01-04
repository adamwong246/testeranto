
import { assert } from "chai";
import { features } from "../testerantoFeatures.test";
import { SolidityTesteranto } from "./solidity.testeranto.test";

// import text from "./text.txt!text";
// import solSource from "../../contracts/MyFirstContract.sol!text";

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
      // TokensAreMinted: [{ tokensToMint: number, asTestUser: number }]
      // TokenIsClaimed: [{ asTestUser: number }]
      // TokenIsRedeemed: [{ tokenToRedeem: number, asTestUser: number }];
    };
    thens: {
      Get: [{ asTestUser: number, expectation: number }];
      // TheNumberOfAllTokensIs: [number];
      // TheNumberOfClaimedTokensIs: [number];
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

      // TokensAreMinted: ({ tokensToMint, asTestUser }) => ({ contract, accounts }) => {
      //   return new Promise((res) => {
      //     console.log("mark 3");
      //     contract.methods.inc().send({ from: accounts[asTestUser] })
      //       .on('receipt', function (x) {
      //         console.log("INCREMENTED!")
      //         res(x)
      //       })
      //   })
      // },
      // TokenIsClaimed: ({ asTestUser }) => () => ["Lazy claim", asTestUser],
      // TokenIsRedeemed: ({ tokenToRedeem, asTestUser }) => () => ["redeem me", tokenToRedeem, asTestUser],
    },
    Thens: {
      Get: ({ asTestUser, expectation }) => async ({ contract, accounts }) => {

        const actual = await contract.methods.get().call();

        assert.equal((expectation), parseInt(actual))

        // contract.methods.get().call().then((actual, y) =>

        //   // console.error("wtf", x, y)
        // );
        //   .send({ from: accounts[asTestUser] }).then((x) => {
        //   console.log("mark=2", x)
        // })
        // const actual = (await contract.methods.get().call({ from: accounts[asTestUser] }));

        // console.log("mark0", asTestUser, expectation, actual);

        // assert.equal((expectation), actual);
      }

      // TheNumberOfAllTokensIs: (numberOfTokens) => ({ contract }) =>
      //   assert.equal(1, 1),
      // TheNumberOfClaimedTokensIs: (numberOfTokens) => ({ contract }) =>
      //   assert.equal(1, 1),
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
            "idk",
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
          // Given.Default(
          //   "idk",
          //   [features.hello],
          //   [
          //     When.TokensAreMinted({
          //       tokensToMint: 2,
          //       asTestUser: 1
          //     })

          //   ],
          //   [
          //     Then.TheNumberOfAllTokensIs(3)
          //   ],
          //   "my first contract"
          // ),

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
