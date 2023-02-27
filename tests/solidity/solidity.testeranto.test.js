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
import { solCompile } from "./truffle.mjs";
export const SolidityTesteranto = (testImplementations, testSpecifications, testInput) => __awaiter(void 0, void 0, void 0, function* () {
    const compilation = (yield solCompile(testInput[0])).contracts.find((c) => c.contractName === testInput[0]);
    return Testeranto(testInput, testSpecifications, testImplementations, { ports: 0 }, {
        beforeAll: () => __awaiter(void 0, void 0, void 0, function* () { return compilation; }),
        beforeEach: (contract) => __awaiter(void 0, void 0, void 0, function* () {
            // https://github.com/trufflesuite/ganache#programmatic-use
            const provider = Ganache.provider({
                seed: "drizzle-utils",
                gasPrice: 7000000,
            });
            /* @ts-ignore:next-line */
            const web3 = new Web3(provider);
            const accounts = yield web3.eth.getAccounts();
            const argz = yield testInput[1](web3);
            const size = Buffer.byteLength(contract.deployedBytecode.bytes, 'utf8') / 2;
            console.log('contract size is', size);
            return {
                contract: yield (new web3.eth.Contract(contract.abi))
                    .deploy({
                    data: contract.bytecode.bytes,
                    arguments: argz
                })
                    .send({ from: accounts[0], gas: 7000000 }),
                accounts,
                provider
            };
        }),
        andWhen: ({ provider, contract, accounts }, callback) => __awaiter(void 0, void 0, void 0, function* () { return (callback())({ contract, accounts }); }),
    });
});
