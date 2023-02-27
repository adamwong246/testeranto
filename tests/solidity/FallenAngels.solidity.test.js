var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from "chai";
import { SolidityTesteranto } from "./solidity.testeranto.test";
const ipfsURL = "ipfs://QmcceQ5mbWixKox1jnEA67kKZuTojCyobfXBJtd7ewJjP4/";
const nullData = "0x";
export const FallenAngelsTesteranto = SolidityTesteranto({
    Suites: {
        Default: "FallenAngels.sol"
    },
    Givens: {
        Default: () => {
            return 'FallenAngels.sol';
        }
    },
    Whens: {
        lazyMint: (amount) => ({ contract, accounts }) => {
            return contract.methods.lazyMint(amount, ipfsURL, nullData).send({
                from: accounts[0],
                gas: 2100000,
            })
                .on('receipt', function (x) {
                return (x);
            });
        },
        // redeem: (asTestUser) => ({ contract, accounts }) => {
        // },
    },
    Thens: {
        nextTokenIdToClaim: (expectation) => ({ contract, accounts }) => __awaiter(void 0, void 0, void 0, function* () { return assert.equal((expectation), parseInt((yield contract.methods.nextTokenIdToClaim().call()))); }),
        nextTokenIdToMint: (expectation) => ({ contract, accounts }) => __awaiter(void 0, void 0, void 0, function* () { return assert.equal((expectation), parseInt((yield contract.methods.nextTokenIdToMint().call()))); })
    },
    Checks: {
        AnEmptyState: () => 'MyFirstContract.sol',
    },
}, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("FallenAngels, ephemerally take 2", [
            Given.Default([], [], [
                Then.nextTokenIdToMint(0)
            ]),
            Given.Default([], [
                When.lazyMint(1, "Asd", "Qwe")
            ], [
                Then.nextTokenIdToMint(1)
            ]),
            Given.Default([], [
                When.lazyMint(1, "Asd", "Qwe"),
                When.lazyMint(2, "Asd", "Qwe"),
            ], [
                Then.nextTokenIdToMint(3)
            ])
        ], []),
    ];
}, ['FallenAngels', (web3) => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        return ['fallen angel test', 'fat', accounts[0], '1', accounts[0]];
    })]);
