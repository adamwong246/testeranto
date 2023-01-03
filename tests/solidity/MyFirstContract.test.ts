
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
      TokensAreMinted: [{ tokensToMint: number, asTestUser: number }]
      // TokenIsClaimed: [{ asTestUser: number }]
      // TokenIsRedeemed: [{ tokenToRedeem: number, asTestUser: number }];
    };
    thens: {
      TheNumberOfAllTokensIs: [number];
      TheNumberOfClaimedTokensIs: [number];
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
      TokensAreMinted: ({ tokensToMint, asTestUser }) => ({ contract, users }) => {

        // console.log("TokensAreMinted", Object.keys(x))

        return new Promise((res) => {

          // console.log("TokensAreMinted", Object.keys(x))

          console.log("mark 3", JSON.stringify(contract.methods))
          contract.methods.inc().send({ from: users[asTestUser] })
            .on('receipt', function (x) {
              res(x)
            })
        })

      },
      // TokenIsClaimed: ({ asTestUser }) => () => ["Lazy claim", asTestUser],
      // TokenIsRedeemed: ({ tokenToRedeem, asTestUser }) => () => ["redeem me", tokenToRedeem, asTestUser],
    },
    Thens: {
      TheNumberOfAllTokensIs: (numberOfTokens) => ({ contract }) =>
        assert.equal(1, 1),
      TheNumberOfClaimedTokensIs: (numberOfTokens) => ({ contract }) =>
        assert.equal(1, 1),
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
              When.TokensAreMinted({
                tokensToMint: 2,
                asTestUser: 1
              })

            ],
            [
              Then.TheNumberOfAllTokensIs(3)
            ],
            "my first contract"
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
