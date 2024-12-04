import { CompiledContract } from "@truffle/compile-common";
import { Contract as ContractEthers } from 'ethers';
import { Contract as ContractWeb3 } from 'web3-eth-contract';
import { ethers } from "ethers";
import Ganache, { Server } from "ganache";
import React from "react";
import renderer, { act } from "react-test-renderer";
import Web3 from 'web3';

import { Testeranto, ITestImplementation, ITestSpecification, ITTestShape } from "testeranto";

import { solCompile } from "../../solidity/truffle.mjs";

type Input = {
  contractName: string,
  component: (...a) => JSX.Element
}

type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;
type Selection = {
  contractFarSide: ContractEthers,
  contractNearSide: ContractWeb3,
  accounts,
  server: Server,
  rendereredComponent: renderer.ReactTestRenderer
};

type State = void;

type Subject = {
  compiledContract: CompiledContract,
  component: any
};

type Store = {
  component: any,
  contractFarSide: ContractEthers,
  contractNearSide: ContractWeb3,
  accounts,
  server: Server,
  rendereredComponent: renderer.ReactTestRenderer
};

const reactPropsOfContract = async (contract) => {
  return ({
    counter: Web3.utils.hexToNumber(await contract.get({ gasLimit: 150000 })),
    inc: async () => await contract.inc({ gasLimit: 150000 }),
    dec: async () => await contract.dec({ gasLimit: 150000 })
  });
}

export const StorefrontTesteranto = <
  ITestShape extends ITTestShape,
  IFeatureShape
>(
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape, IFeatureShape>,
  testInput: Input,
) =>
  Testeranto<
    ITestShape,
    Input,
    Subject,
    Store,
    Selection,
    ThenShape,
    WhenShape,
    InitialState,
    IFeatureShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    { ports: 1 },
    {
      beforeAll: async function (npt) {

        const contract = (await solCompile(npt.contractName))
          .contracts.find((c) => c.contractName === npt.contractName);

        if (contract) {
          return {
            compiledContract: contract,
            component: npt.component
          }
        }
        else { throw "idk" }

      },

      beforeEach: async function (subject, props, testResource): Promise<Store> {

        return new Promise((res) => {
          const options = {};
          const port = testResource.ports[0];

          // https://github.com/trufflesuite/ganache#programmatic-use
          const server = Ganache.server(options);

          // start the ganache chain
          server.listen(port, async err => {
            if (err) throw err;
            console.log(`ganache listening on port ${port}...`);

            const providerFarSide = server.provider;
            const accounts = await providerFarSide.request({
              method: "eth_accounts", params: []
            });

            /* @ts-ignore:next-line */
            const web3NearSide = new Web3(providerFarSide);

            // deploy the contract under accounts[0]
            const contractNearSide = await (

              new web3NearSide.eth.Contract(subject.compiledContract.abi as any)
            )
              .deploy({
                /* @ts-ignore:next-line */
                data: subject.compiledContract.bytecode.bytes
              })
              .send({ from: accounts[0], gas: 7000000 });

            /////////////////////////////////////////////

            const web3FarSideProvider = new ethers.providers.JsonRpcProvider(`http://localhost:${port}`);

            // create a test wallet from a ganache account
            const web3FarSideSigner = new ethers.Wallet(
              providerFarSide.getInitialAccounts()[accounts[1]].secretKey,
              web3FarSideProvider
            );

            // create a contract that our test user can access
            const contractFarSide = new ethers.Contract(
              contractNearSide.options.address,
              subject.compiledContract.abi,
              web3FarSideSigner
            );

            let rendereredComponent;
            await act(async () => {
              rendereredComponent = renderer.create(
                React.createElement(subject.component,
                  (await reactPropsOfContract(contractFarSide)),
                  [])
              );
            });

            res({
              contractNearSide,
              contractFarSide,
              accounts,
              server,
              rendereredComponent,
              component: subject.component
            });
          });
        })
      },

      andWhen: async function (store, actioner) {
        await act(async () => {
          await (actioner(store))(store);
          store.rendereredComponent.update(
            React.createElement(store.component,
              await reactPropsOfContract(store.contractFarSide), [])
          );
        })

        return store;
      },

      butThen: async function (store) {
        await act(async () => {
          store.rendereredComponent.update(
            React.createElement(store.component,
              await reactPropsOfContract(store.contractFarSide), [])
          );
        });

        return store;
      },

      afterEach: async function (store, ndx: number, saveTestArtifact) {
        await store.server.close();

        // await act(async () => {
        //   store.rendereredComponent.update(
        //     React.createElement(store.component,
        //       {
        //         counter: ethers.utils.formatEther(await store.contractFarSide.get({ gasLimit: 150000 })),
        //         inc: async () => await store.contractFarSide.inc({ gasLimit: 150000 }),
        //         dec: async () => await store.contractFarSide.dec({ gasLimit: 150000 })
        //       }, [])
        //   );
        // });
      }
    }
  )
