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
import { SolidityRpcTesteranto } from "./solidity-rpc.testeranto.test";
import { commonGivens } from './index.test';
export const MyFirstContractPlusRpcTesteranto = SolidityRpcTesteranto({
    Suites: {
        Default: "Testing a very simple smart contract"
    },
    Givens: {
        Default: () => {
            return 'MyFirstContract.sol';
        }
    },
    Whens: {
        Increment: (asTestUser) => ({ contractFarSide, accounts }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield contractFarSide.inc({ gasLimit: 150000 });
        }),
        Decrement: (asTestUser) => ({ contractFarSide, accounts }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield contractFarSide.dec({ gasLimit: 150000 });
        }),
    },
    Thens: {
        Get: ({ asTestUser, expectation }) => ({ contractFarSide, accounts }) => __awaiter(void 0, void 0, void 0, function* () { return assert.equal((expectation), parseInt((yield contractFarSide.get({ gasLimit: 150000 })))); })
    },
    Checks: {
        AnEmptyState: () => 'MyFirstContract.sol',
    },
}, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("Testing a very simple smart contract over RPC", commonGivens(Given, When, Then, features), [
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
}, "solSource", 'MyFirstContract');
