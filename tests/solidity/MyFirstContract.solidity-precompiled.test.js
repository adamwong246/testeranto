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
import { features } from "../testerantoFeatures.test";
import { SolidityPrecompiledTesteranto } from "./solidity-precompiled.testeranto.test";
import { commonGivens } from './index.test';
export const MyFirstContractPrecompiledTesteranto = SolidityPrecompiledTesteranto({
    Suites: {
        Default: "Testing a very simple smart contract"
    },
    Givens: {
        Default: () => {
            return 'MyFirstContract.sol';
        }
    },
    Whens: {
        Increment: (asTestUser) => ({ contract, accounts }) => {
            return contract.methods.inc().send({ from: accounts[asTestUser] })
                .on('receipt', function (x) {
                return (x);
            });
        },
        Decrement: (asTestUser) => ({ contract, accounts }) => {
            return new Promise((res) => {
                contract.methods.dec().send({ from: accounts[asTestUser] })
                    .then(function (x) {
                    res(x);
                });
            });
        },
    },
    Thens: {
        Get: ({ asTestUser, expectation }) => ({ contract, accounts }) => __awaiter(void 0, void 0, void 0, function* () { return assert.equal((expectation), parseInt((yield contract.methods.get().call()))); })
    },
    Checks: {
        AnEmptyState: () => 'MyFirstContract.sol',
    },
}, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("Testing a very simple smart contract precompiled?", commonGivens(Given, When, Then, features), [
        // Check.AnEmptyState(
        //   "imperative style",
        //   [`aloha`],
        //   async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
        //     await TheEmailIsSetTo("foo");
        //     await TheEmailIs("foo");
        //     const reduxPayload = await TheEmailIsSetTo("foobar");
        //     await TheEmailIs("foobar");
        //     // assert.deepEqual(reduxPayload, {
        //     //   type: "login app/setEmail",
        //     //   payload: "foobar",
        //     // });
        //   }
        // ),
        ]),
    ];
}, ['MyFirstContract', (web3) => __awaiter(void 0, void 0, void 0, function* () {
        // const accounts = await web3.eth.getAccounts();
        return [];
    })]
// 'MyFirstContract'
);
