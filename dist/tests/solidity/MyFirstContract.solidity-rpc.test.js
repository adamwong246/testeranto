// tests/solidity/MyFirstContract.solidity-rpc.test.ts
import { assert } from "chai";
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";

// tests/solidity/solidity-rpc.testeranto.test.ts
import fs from "fs";
import path from "path";
import Ganache from "ganache";
import TruffleCompile from "truffle-compile";
import Web3 from "web3";
import { Testeranto } from "testeranto";
import { ethers } from "ethers";
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
var SolidityRpcTesteranto = (testImplementations, testSpecifications, testInput, contractName) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeAll: async () => (await compile(`../../../contracts/${contractName}.sol`))[contractName],
    beforeEach: (contract, i, tr) => {
      return new Promise((res) => {
        const options = {};
        const port = tr.ports[0];
        const server = Ganache.server(options);
        server.listen(port, async (err) => {
          console.log(`ganache listening on port ${port}...`);
          if (err)
            throw err;
          const providerFarSide = server.provider;
          const accounts = await providerFarSide.request({ method: "eth_accounts", params: [] });
          const web3NearSide = new Web3(providerFarSide);
          const contractNearSide = await new web3NearSide.eth.Contract(contract.abi).deploy({ data: contract.bytecode }).send({ from: accounts[0], gas: 15e4 });
          const web3FarSideProvider = new ethers.providers.JsonRpcProvider(`http://localhost:${port}`);
          const web3FarSideSigner = new ethers.Wallet(
            providerFarSide.getInitialAccounts()[accounts[1]].secretKey,
            web3FarSideProvider
          );
          const contractFarSide = new ethers.Contract(contractNearSide.options.address, contract.abi, web3FarSideSigner);
          res({
            contractNearSide,
            contractFarSide,
            accounts,
            server
          });
        });
      });
    },
    afterEach: async ({ server }) => await server.close(),
    andWhen: async ({ contractFarSide, accounts }, callback) => callback()({ contractFarSide, accounts })
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

// tests/solidity/MyFirstContract.solidity-rpc.test.ts
var MyFirstContractPlusRpcTesteranto = SolidityRpcTesteranto(
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
      Increment: (asTestUser) => async ({ contractFarSide, accounts }) => {
        return await contractFarSide.inc({ gasLimit: 15e4 });
      },
      Decrement: (asTestUser) => async ({ contractFarSide, accounts }) => {
        return await contractFarSide.dec({ gasLimit: 15e4 });
      }
    },
    Thens: {
      Get: ({ asTestUser, expectation }) => async ({ contractFarSide, accounts }) => assert.equal(expectation, parseInt(await contractFarSide.get({ gasLimit: 15e4 })))
    },
    Checks: {
      AnEmptyState: () => "MyFirstContract.sol"
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing a very simple smart contract over RPC",
        commonGivens(Given, When, Then, features),
        []
      )
    ];
  },
  "solSource",
  "MyFirstContract"
);
export {
  MyFirstContractPlusRpcTesteranto
};
