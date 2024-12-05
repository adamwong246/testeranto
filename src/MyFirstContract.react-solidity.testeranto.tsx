import { assert } from "chai";

import { features } from "../features.test.mjs";
import Testeranto, {
  // IInput,
} from "../subPackages/solidity/react.testeranto";

// import MyFirstContractSol from "../contracts/MyFirstContract.sol";

type IInput = { contractName: string; abi: any };

import {
  IMyFirstContractTest,
  commonGivens,
  // MyFirstContractTestInput,
} from "./MyFirstContract.test";
import { ITestImplementation } from "testeranto/src/Types";
import { MyFirstContractUI } from "./MyFirstContractUI";
// import { MyFirstContract } from "./MyFirstContractUI";

// export const MyFirstContractTestInput = MyFirstContractSol.contracts.find(
//   (c) => c.contractName === "MyFirstContract"
// ) as { contractName: string; abi: any };

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

export default Testeranto(
  testImplementation,

  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Test a react app backed by a solidity contract, separated by a RPC channel",
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
  MyFirstContractUI
  // {
  //   // contract: MyFirstContractSol.contracts.find(
  //   //   (c) => c.contractName === "MyFirstContract"
  //   // ) as { contractName: string; abi: any },
  //   MyFirstContractUI
  // }
);
