import { Compile } from "@truffle/compile-solidity";
import { Contract } from 'web3-eth-contract';
import fs from "fs/promises";
import Ganache from "ganache";
import TruffleConfig from "@truffle/config";
import Web3 from 'web3';

import { Testeranto } from "testeranto";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto";

type Selection = {
  contract: Contract,
  accounts,
  provider: unknown,
};

type WhenShape = any;
type ThenShape = any;
type Input = any;
type Ibis = any;

// parent: node_modules/.../ERC721/ERC721.sol
// returns absolute path of a relative one using the parent path
const buildFullPath = (parent, path) => {
  let curDir = parent.substr(0, parent.lastIndexOf("/")); //i.e. ./node/.../ERC721

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

const solidifier = async (path, recursivePayload = {}) => {

  const text = (await fs.readFile(path)).toString();

  const importLines = text
    .split('\n')
    .filter((line, index, arr) => {
      return index !== arr.length - 1 &&
        line !== "" &&
        line.trim().startsWith("import") === true
    })
    .map((line) => {
      const relativePathsplit = line.split(' ');
      return buildFullPath(path, relativePathsplit[relativePathsplit.length - 1].trim().slice(1, -2));
    });

  for (const importLine of importLines) {
    recursivePayload = {
      ...recursivePayload,
      ...(await solidifier(importLine))
    }
  }

  recursivePayload[path] = text

  return recursivePayload;
}

const compile = async (entrySolidityFile) => {
  const sources = await solidifier(process.cwd() + `/contracts/${entrySolidityFile}.sol`)

  const remmapedSources = {};
  for (const filepath of Object.keys(sources)) {
    const x = filepath.split(process.cwd() + "/contracts/");
    if (x.length === 1) {
      remmapedSources[(filepath.split(process.cwd() + "/node_modules/"))[1]] = sources[filepath]
    } else {
      remmapedSources[filepath] = sources[filepath]
    }
  }

  return await Compile.sources({ sources: remmapedSources, options: TruffleConfig.detect() })
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
      beforeAll: async () =>
        (await compile(contractName)).contracts.find((c) => c.contractName === contractName),

      beforeEach: async (contract: Ibis) => {

        // https://github.com/trufflesuite/ganache#programmatic-use
        const provider = Ganache.provider({
          seed: "drizzle-utils",
          gasPrice: 150000
        });

        /* @ts-ignore:next-line */
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();

        console.log("contract", contract);

        return {
          contract: await (new web3.eth.Contract(contract.abi))
            .deploy({ data: contract.bytecode.bytes })
            .send({ from: accounts[0], gas: 150000 }),
          accounts,
          provider
        };
      },
      andWhen: async ({ provider, contract, accounts }, callback: any) =>
        (callback())({ contract, accounts }),
    }
  )
