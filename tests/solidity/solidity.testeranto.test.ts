import { Contract } from 'web3-eth-contract';
import Ganache from "ganache";
import Web3 from 'web3';

import { Testeranto } from "testeranto";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto";

import { solCompile } from "./truffle";

type Selection = {
  contract: Contract,
  accounts,
  provider: unknown,
};

type WhenShape = any;
type ThenShape = any;
type Input = any;
type Ibis = any;

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
        (await solCompile(contractName)).contracts.find((c) => c.contractName === contractName),

      beforeEach: async (contract: Ibis) => {

        // https://github.com/trufflesuite/ganache#programmatic-use
        const provider = Ganache.provider({
          seed: "drizzle-utils",
          gasPrice: 7000000
        });

        /* @ts-ignore:next-line */
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();

        // console.log("contract", contract);
        return {
          contract: await (new web3.eth.Contract(contract.abi))
            .deploy({ data: contract.bytecode.bytes })
            .send({ from: accounts[0], gas: 7000000 }),
          accounts,
          provider
        };
      },
      andWhen: async ({ provider, contract, accounts }, callback: any) =>
        (callback())({ contract, accounts }),
    }
  )
