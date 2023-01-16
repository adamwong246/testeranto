// tests/solidity/MyFirstContract.solidity-rpc.test.ts
import { assert } from "chai";
import { features } from "/Users/marcus/Documents/websites/kokomoBay/dist/tests/testerantoFeatures.test.js";

// tests/solidity/solidity-rpc.testeranto.test.ts
import Ganache from "ganache";
import Web3 from "web3";
import { Testeranto } from "testeranto";
import { ethers } from "ethers";

// tests/solidity/truffle.ts
import fs from "fs/promises";
import { Compile } from "@truffle/compile-solidity";
import TruffleConfig from "@truffle/config";
var buildFullPath = (parent, path) => {
  let curDir = parent.substr(0, parent.lastIndexOf("/"));
  if (path.startsWith("@")) {
    return process.cwd() + "/node_modules/" + path;
  }
  if (path.startsWith("./")) {
    return curDir + "/" + path.substr(2);
  }
  while (path.startsWith("../")) {
    curDir = curDir.substr(0, curDir.lastIndexOf("/"));
    path = path.substr(3);
  }
  return curDir + "/" + path;
};
var solidifier = async (path, recursivePayload = {}) => {
  const text = (await fs.readFile(path)).toString();
  const importLines = text.split("\n").filter((line, index, arr) => {
    return index !== arr.length - 1 && line !== "" && line.trim().startsWith("import") === true;
  }).map((line) => {
    const relativePathsplit = line.split(" ");
    return buildFullPath(path, relativePathsplit[relativePathsplit.length - 1].trim().slice(1, -2));
  });
  for (const importLine of importLines) {
    recursivePayload = {
      ...recursivePayload,
      ...await solidifier(importLine)
    };
  }
  recursivePayload[path] = text;
  return recursivePayload;
};
var solCompile = async (entrySolidityFile) => {
  const sources = await solidifier(process.cwd() + `/contracts/${entrySolidityFile}.sol`);
  const remmapedSources = {};
  for (const filepath of Object.keys(sources)) {
    const x = filepath.split(process.cwd() + "/contracts/");
    if (x.length === 1) {
      remmapedSources[filepath.split(process.cwd() + "/node_modules/")[1]] = sources[filepath];
    } else {
      remmapedSources[filepath] = sources[filepath];
    }
  }
  return await Compile.sources({ sources: remmapedSources, options: TruffleConfig.detect() });
};

// tests/solidity/solidity-rpc.testeranto.test.ts
var SolidityRpcTesteranto = (testImplementations, testSpecifications, testInput, contractName) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeAll: async () => (await solCompile(contractName)).contracts.find((c) => c.contractName === contractName),
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
          const contractNearSide = await new web3NearSide.eth.Contract(contract.abi).deploy({ data: contract.bytecode.bytes }).send({ from: accounts[0], gas: 7e6 });
          const web3FarSideProvider = new ethers.providers.JsonRpcProvider(`http://localhost:${port}`);
          const web3FarSideSigner = new ethers.Wallet(
            providerFarSide.getInitialAccounts()[accounts[1]].secretKey,
            web3FarSideProvider
          );
          const contractFarSide = new ethers.Contract(
            contractNearSide.options.address,
            contract.abi,
            web3FarSideSigner
          );
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
