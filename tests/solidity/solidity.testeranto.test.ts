import fs from "fs";
import path from "path";
import Ganache from "ganache";
import TruffleCompile from "truffle-compile";
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { SpawnSyncReturns, spawnSync } from 'node:child_process';

import { TesterantoFactory } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type Selection = {
  contract: Contract,
  accounts,
  provider: unknown,
};
type TestResource = never;
type WhenShape = any;
type ThenShape = any;
type Input = any;

// Promisify truffle-compile
const truffleCompile = (...args) =>
  new Promise(resolve => TruffleCompile(...args, (_, data) => resolve(data)));

const compile = async filename => {
  const sourcePath = path.join(__dirname, "../contracts", filename);

  const sources = {
    [sourcePath]: fs.readFileSync(sourcePath, { encoding: "utf8" }),
  };

  const options = {
    contracts_directory: path.join(__dirname, "../contracts"),
    compilers: {
      solc: {
        version: "0.5.2",
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
          evmVersion: "byzantium",
        },
      },
    },
  };

  const artifact = await truffleCompile(sources, options);
  return artifact;
};

export const SolidityTesteranto = <
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    string,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input,
  contractName: string,
  entryPath: string
) =>
  TesterantoFactory<
    ITestShape,
    string,
    SpawnSyncReturns<Buffer>,
    Selection,
    Selection,
    WhenShape,
    ThenShape,
    TestResource,
    string
  >(
    testInput,
    testSpecifications,
    testImplementations,
    "port",
    {
      beforeAll: async (x) => spawnSync('truffle', ['compile']),

      beforeEach: async (subject, initialValues: any, ethereumNetworkPort: string) => {
        /* @ts-ignore:next-line */
        const { MyFirstContract } = await compile("../../../contracts/MyFirstContract.sol");
        const provider = Ganache.provider({ seed: "drizzle-utils" });
        /* @ts-ignore:next-line */
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const contractInstance = new web3.eth.Contract(MyFirstContract.abi);
        return {
          contract: await contractInstance
            .deploy({ data: MyFirstContract.bytecode })
            .send({ from: accounts[0], gas: 150000 }),
          accounts,
          provider
        };
      },
      andWhen: async ({ provider, contract, accounts }, callback: any, testResource: never) => {
        return (callback())({ contract, accounts });
      },
    },
    entryPath
  )
