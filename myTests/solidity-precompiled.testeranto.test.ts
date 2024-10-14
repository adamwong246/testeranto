/// <reference types="../index.d.ts" />

import { Contract } from 'web3-eth-contract';
import Ganache from "ganache";
import Web3 from 'web3';

import Testeranto from "testeranto/src/Node";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto/src/core";

import compilations from "../../contracts/MyFirstContract.sol";

type Selection = {
  contract: Contract,
  accounts,
  provider: unknown,
};

type WhenShape = any;
type ThenShape = any;
type Input = [string, (_w3: Web3) => Promise<string[]>];
type Ibis = any;

export const SolidityPrecompiledTesteranto = async <
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
  testInput,
) => {
  const compilation = compilations.contracts.find(
    (c) => c.contractName === testInput[0]
  );

  return Testeranto(
    testInput,
    testSpecifications,
    testImplementations,

    {
      beforeAll: async () => compilation,

      beforeEach: async (contract: Ibis) => {

        // https://github.com/trufflesuite/ganache#programmatic-use
        const provider = Ganache.provider();

        /* @ts-ignore:next-line */
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const argz = await testInput[1](web3);

        const size = Buffer.byteLength(contract.deployedBytecode.bytes, 'utf8') / 2;
        // console.log('contract size is', size);

        return {
          contract: await (new web3.eth.Contract(contract.abi))
            .deploy({
              data: contract.bytecode.bytes,
              arguments: argz
            })
            .send({ from: accounts[0], gas: 7000000 }),
          accounts,
          provider
        };
      },
      andWhen: async ({ provider, contract, accounts }, callback: any) =>
        callback({ contract, accounts }),
    },

    { ports: 0 },
  );
}


