var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from "ethers";
import Ganache from "ganache";
import React from "react";
import renderer, { act } from "react-test-renderer";
import Web3 from 'web3';
import { Testeranto } from "testeranto";
import { solCompile } from "../../solidity/truffle.mjs";
const reactPropsOfContract = (contract) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        counter: Web3.utils.hexToNumber(yield contract.get({ gasLimit: 150000 })),
        inc: () => __awaiter(void 0, void 0, void 0, function* () { return yield contract.inc({ gasLimit: 150000 }); }),
        dec: () => __awaiter(void 0, void 0, void 0, function* () { return yield contract.dec({ gasLimit: 150000 }); })
    });
});
export const StorefrontTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 1 }, {
    beforeAll: function (npt) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = (yield solCompile(npt.contractName))
                .contracts.find((c) => c.contractName === npt.contractName);
            if (contract) {
                return {
                    compiledContract: contract,
                    component: npt.component
                };
            }
            else {
                throw "idk";
            }
        });
    },
    beforeEach: function (subject, props, testResource) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => {
                const options = {};
                const port = testResource.ports[0];
                // https://github.com/trufflesuite/ganache#programmatic-use
                const server = Ganache.server(options);
                // start the ganache chain
                server.listen(port, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        throw err;
                    console.log(`ganache listening on port ${port}...`);
                    const providerFarSide = server.provider;
                    const accounts = yield providerFarSide.request({
                        method: "eth_accounts", params: []
                    });
                    /* @ts-ignore:next-line */
                    const web3NearSide = new Web3(providerFarSide);
                    // deploy the contract under accounts[0]
                    const contractNearSide = yield (new web3NearSide.eth.Contract(subject.compiledContract.abi))
                        .deploy({
                        /* @ts-ignore:next-line */
                        data: subject.compiledContract.bytecode.bytes
                    })
                        .send({ from: accounts[0], gas: 7000000 });
                    /////////////////////////////////////////////
                    const web3FarSideProvider = new ethers.providers.JsonRpcProvider(`http://localhost:${port}`);
                    // create a test wallet from a ganache account
                    const web3FarSideSigner = new ethers.Wallet(providerFarSide.getInitialAccounts()[accounts[1]].secretKey, web3FarSideProvider);
                    // create a contract that our test user can access
                    const contractFarSide = new ethers.Contract(contractNearSide.options.address, subject.compiledContract.abi, web3FarSideSigner);
                    let rendereredComponent;
                    yield act(() => __awaiter(this, void 0, void 0, function* () {
                        rendereredComponent = renderer.create(React.createElement(subject.component, (yield reactPropsOfContract(contractFarSide)), []));
                    }));
                    res({
                        contractNearSide,
                        contractFarSide,
                        accounts,
                        server,
                        rendereredComponent,
                        component: subject.component
                    });
                }));
            });
        });
    },
    andWhen: function (store, actioner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield act(() => __awaiter(this, void 0, void 0, function* () {
                yield (actioner(store))(store);
                store.rendereredComponent.update(React.createElement(store.component, yield reactPropsOfContract(store.contractFarSide), []));
            }));
            return store;
        });
    },
    butThen: function (store) {
        return __awaiter(this, void 0, void 0, function* () {
            yield act(() => __awaiter(this, void 0, void 0, function* () {
                store.rendereredComponent.update(React.createElement(store.component, yield reactPropsOfContract(store.contractFarSide), []));
            }));
            return store;
        });
    },
    afterEach: function (store, ndx, saveTestArtifact) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.server.close();
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
        });
    }
});
