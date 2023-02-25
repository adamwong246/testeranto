// tests/solidity/MyFirstContract.solidity-rpc.test.ts
import { assert } from "chai";
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.mjs";

// tests/solidity/solidity-rpc.testeranto.test.ts
import Ganache from "ganache";
import Web3 from "web3";
import { Testeranto } from "testeranto";
import { ethers } from "ethers";

// tests/solidity/truffle.mts
import fs from "fs/promises";
import path from "path";
import { Compile } from "@truffle/compile-solidity";
import TruffleConfig from "@truffle/config";
var buildFullPath = (parent, path2) => {
  let curDir = parent.substr(0, parent.lastIndexOf("/"));
  if (path2.startsWith("@")) {
    return process.cwd() + "/node_modules/" + path2;
  }
  if (path2.startsWith("./")) {
    return curDir + "/" + path2.substr(2);
  }
  while (path2.startsWith("../")) {
    curDir = curDir.substr(0, curDir.lastIndexOf("/"));
    path2 = path2.substr(3);
  }
  return curDir + "/" + path2;
};
var solidifier = async (path2, recursivePayload = {}) => {
  const text = (await fs.readFile(path2)).toString();
  const importLines = text.split("\n").filter((line, index, arr) => {
    return index !== arr.length - 1 && line !== "" && line.trim().startsWith("import") === true;
  }).map((line) => {
    const relativePathsplit = line.split(" ");
    return buildFullPath(path2, relativePathsplit[relativePathsplit.length - 1].trim().slice(1, -2));
  });
  for (const importLine of importLines) {
    recursivePayload = {
      ...recursivePayload,
      ...await solidifier(importLine)
    };
  }
  recursivePayload[path2] = text;
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
  const tConfig = new TruffleConfig();
  console.log(tConfig);
  const options = TruffleConfig.load(path.resolve(process.cwd(), `truffle-config.cjs`));
  console.log("solc settings", options._values.compilers.solc.settings);
  return await Compile.sources({
    sources: remmapedSources,
    options
  });
};

// tests/solidity/solidity-rpc.testeranto.test.ts
var SolidityRpcTesteranto = (testImplementations, testSpecifications, testInput, contractName) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeAll: async () => (await solCompile(contractName)).contracts.find((c) => c.contractName === contractName),
    // (await compile(`../../../contracts/${contractName}.sol`) as any)[contractName] as Ibis,
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
    [`hello`],
    [],
    [
      Then.Get({ asTestUser: 1, expectation: 0 })
    ],
    "my first contract"
  ),
  Given.Default(
    [`hello`],
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
    [`hello`],
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
  // Given.Default(
  //   [`hello`],
  //   [
  //     When.Decrement(1),
  //     When.Decrement(1),
  //     When.Decrement(1),
  //     When.Increment(1),
  //     When.Increment(1),
  //   ],
  //   [
  //     Then.Get({ asTestUser: 1, expectation: 1.157920892373162e+77 })
  //   ],
  //   "this test should fail"
  // ),
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
      )
    ];
  },
  "solSource",
  "MyFirstContract"
);
export {
  MyFirstContractPlusRpcTesteranto
};
