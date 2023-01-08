import fs from "fs";
import path from "path";
import Ganache from "ganache";
import TruffleCompile from "truffle-compile";
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { Testeranto } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/types";

type Selection = {
  contract: Contract,
  accounts,
  provider: unknown,
};

type WhenShape = any;
type ThenShape = any;
type Input = any;
type Ibis = any;

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
  contractName: string
) =>
  Testeranto<
    ITestShape,
    string,
    Ibis,
    Selection,
    Selection,
    WhenShape,
    ThenShape,
    string
  >(
    testInput,
    testSpecifications,
    testImplementations,
    { ports: 0 },
    {
      beforeAll: async () => {
        return (await compile(`../../../contracts/${contractName}.sol`) as any)[contractName] as Ibis
      },
      beforeEach: async (contract: Ibis) => {

        // https://github.com/trufflesuite/ganache#programmatic-use
        const provider = Ganache.provider({ seed: "drizzle-utils" });

        /* @ts-ignore:next-line */
        const web3 = new Web3(provider);

        const accounts = await web3.eth.getAccounts();

        return {
          contract: await (new web3.eth.Contract(contract.abi))
            .deploy({ data: contract.bytecode })
            .send({ from: accounts[0], gas: 150000 }),
          accounts,
          provider
        };
      },
      andWhen: async ({ provider, contract, accounts }, callback: any) =>
        (callback())({ contract, accounts }),
    }
  )
