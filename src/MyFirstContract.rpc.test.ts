import { assert } from "chai";

import { features } from "../features.test.mjs";
import Testeranto, {
  IInput,
} from "../subPackages/solidity/Contract-rpc.testeranto.test";

import {
  IMyFirstContractTest,
  commonGivens,
  MyFirstContractTestInput,
} from "./MyFirstContract.test";
import { ITestImplementation } from "testeranto/src/Types";

const testImplementation: ITestImplementation<
  IMyFirstContractTest<IMyFirstContractTest<IInput>>
> = {
  suites: {
    Default: "Testing a very simple smart contract",
  },
  givens: {
    Default: () => {
      return "MyFirstContract.sol";
    },
  },
  whens: {
    Increment:
      (asTestUser) =>
      async ({ contractFarSide, accounts }) => {
        return await contractFarSide.inc({ gasLimit: 150000 });
      },
    Decrement:
      (asTestUser) =>
      async ({ contractFarSide, accounts }) => {
        return await contractFarSide.dec({ gasLimit: 150000 });
      },
  },
  thens: {
    Get:
      ({ asTestUser, expectation }) =>
      async ({ contractFarSide, accounts }) =>
        assert.equal(
          expectation,
          parseInt(await contractFarSide.get({ gasLimit: 150000 }))
        ),
  },
  checks: {
    AnEmptyState: () => "MyFirstContract.sol",
  },
};

export const MyFirstContractPlusRpcTesteranto = Testeranto<
  IMyFirstContractTest<IMyFirstContractTest<IInput>>
>(
  testImplementation,

  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing a very simple smart contract over RPC",
        commonGivens(Given, When, Then, features),
        [
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
        ]
      ),
    ];
  },
  MyFirstContractTestInput
);
