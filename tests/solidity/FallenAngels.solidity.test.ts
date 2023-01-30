
import { assert } from "chai";
import { features } from "../testerantoFeatures.test";
import { SolidityTesteranto } from "./solidity.testeranto.test";

const ipfsURL = "ipfs://QmcceQ5mbWixKox1jnEA67kKZuTojCyobfXBJtd7ewJjP4/";
const nullData = "0x"

export const FallenAngelsTesteranto = SolidityTesteranto<
  {
    suites: {
      Default;
    };
    givens: {
      Default;
    };
    whens: {
      lazyMint: [number, string, string];
      // redeem: [number];
    };
    thens: {
      nextTokenIdToClaim: [expectation: number];
      nextTokenIdToMint: [expectation: number];
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
      lazyMint: (amount) => ({ contract, accounts }) => {
        return contract.methods.lazyMint(amount, ipfsURL, nullData).send({
          from: accounts[0],
          gas: 2100000,
        })
          .on('receipt', function (x) {
            return (x);
          })
      },
      // redeem: (asTestUser) => ({ contract, accounts }) => {

      // },

    },
    Thens: {
      nextTokenIdToClaim: (expectation) => async ({ contract, accounts }) =>
        assert.equal((expectation), parseInt((await contract.methods.nextTokenIdToClaim().call()))),
      nextTokenIdToMint: (expectation) => async ({ contract, accounts }) =>
        assert.equal((expectation), parseInt((await contract.methods.nextTokenIdToMint().call())))
    },
    Checks: {
      AnEmptyState: () => 'MyFirstContract.sol',
    },
  },

  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "FallenAngels, ephemerally take 2",
        [
          Given.Default([], [
          ], [
            Then.nextTokenIdToMint(0)
          ]),

          Given.Default([], [
            When.lazyMint(1, "Asd", "Qwe")
          ], [
            Then.nextTokenIdToMint(1)
          ]),

          Given.Default([], [
            When.lazyMint(1, "Asd", "Qwe"),
            When.lazyMint(2, "Asd", "Qwe"),
          ], [
            Then.nextTokenIdToMint(3)
          ])
        ],

        [

        ]
      ),
    ];
  },
  ['FallenAngels', async (web3) => {
    const accounts = await web3.eth.getAccounts();
    return ['fallen angel test', 'fat', accounts[0], '1', accounts[0]]
  }]
);
