// import { assert } from "chai";
// import fs from "fs";
import { features } from "../features.test.mjs";
// import Web3 from "web3";
import Testeranto from "testeranto/src/Node";

import {
  // IMyFirstContractTest,
  commonGivens,
  MyFirstContractTestInput,
} from "./MyFirstContract.specification.test";
// import {
//   // IPartialNodeInterface,
//   ITestImplementation,
// } from "testeranto/src/Types";
// import { ethers } from "ethers";
// import Ganache from "ganache";
import { IInput } from "../subPackages/solidity/Contract.testeranto.test";
// import { testInterface } from "../../testeranto/src/SubPackages/react/jsx";
// import { ITTestResourceConfiguration } from "../../testeranto/src/lib";
// import { PM } from "../../testeranto/src/PM";
import tInterface from "./MyFirstContract.solidity-react.interface.test";
import testImplementation from "./MyFirstContract.solidity-react.implementation.test";
import { IMyFirstContractTest } from "./MyFirstContract.solidity-react.shape.test";

export default Testeranto<IMyFirstContractTest<IMyFirstContractTest<IInput>>>(
  MyFirstContractTestInput,

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

  testImplementation,
  tInterface
);
