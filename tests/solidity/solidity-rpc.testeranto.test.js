var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Ganache from "ganache";
import Web3 from 'web3';
import { Testeranto } from "testeranto";
import { ethers } from "ethers";
import { solCompile } from "./truffle.mjs";
export const SolidityRpcTesteranto = (testImplementations, testSpecifications, testInput, contractName) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 1 }, {
    beforeAll: () => __awaiter(void 0, void 0, void 0, function* () { return (yield solCompile(contractName)).contracts.find((c) => c.contractName === contractName); }),
    // (await compile(`../../../contracts/${contractName}.sol`) as any)[contractName] as Ibis,
    beforeEach: (contract, i, tr) => {
        return new Promise((res) => {
            const options = {};
            const port = tr.ports[0];
            // https://github.com/trufflesuite/ganache#programmatic-use
            const server = Ganache.server(options);
            // start the ganache chain
            server.listen(port, (err) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(`ganache listening on port ${port}...`);
                if (err)
                    throw err;
                const providerFarSide = server.provider;
                const accounts = yield providerFarSide.request({ method: "eth_accounts", params: [] });
                /* @ts-ignore:next-line */
                const web3NearSide = new Web3(providerFarSide);
                // deploy the contract under accounts[0]
                const contractNearSide = yield (new web3NearSide.eth.Contract(contract.abi))
                    .deploy({ data: contract.bytecode.bytes })
                    .send({ from: accounts[0], gas: 7000000 });
                /////////////////////////////////////////////
                const web3FarSideProvider = new ethers.providers.JsonRpcProvider(`http://localhost:${port}`);
                // create a test wallet from a ganache account
                const web3FarSideSigner = new ethers.Wallet(providerFarSide.getInitialAccounts()[accounts[1]].secretKey, web3FarSideProvider);
                // create a contract that our test user can access
                const contractFarSide = new ethers.Contract(contractNearSide.options.address, contract.abi, web3FarSideSigner);
                res({
                    contractNearSide,
                    contractFarSide,
                    accounts,
                    server,
                });
            }));
        });
    },
    afterEach: ({ server }) => __awaiter(void 0, void 0, void 0, function* () { return yield server.close(); }),
    andWhen: ({ contractFarSide, accounts }, callback) => __awaiter(void 0, void 0, void 0, function* () { return (callback())({ contractFarSide, accounts }); }),
});
