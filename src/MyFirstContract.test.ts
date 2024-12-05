import { IBaseTest } from "testeranto/src/Types";

import { BaseGiven } from "../../testeranto/src/lib/abstractBase";

import MyFirstContract from "../contracts/MyFirstContract.sol";

export const MyFirstContractTestInput = MyFirstContract.contracts.find(
  (c) => c.contractName === "MyFirstContract"
) as { contractName: string; abi: any };

export type IMyFirstContractTest<Input> = {
  iinput: Input;
  isubject: string;
  istore: string;
  iselection: string;
  given: string;
  when: string;
  then: string;
  suites: {
    Default: string;
  };
  givens: {
    Default: [string];
  };
  whens: {
    Increment: [number];
    Decrement: [number];
  };
  thens: {
    Get: [{ asTestUser: number; expectation: number }];
  };
  checks: {
    AnEmptyState: [];
  };
} & IBaseTest;

export const commonGivens = (
  Given,
  When,
  Then,
  features
): Record<string, BaseGiven<IMyFirstContractTest<any>>> => {
  return {
    test0: Given.Default(
      "my first contract",
      [
        // When.Increment(1), When.Increment(1), When.Increment(1)
      ],
      [Then.Get({ asTestUser: 1, expectation: 0 })]
      // "my first contract"
    ),

    test1: Given.Default(
      [`hello`],
      [
        When.Increment(1),
        When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
        // When.Increment(1),
      ],
      [Then.Get({ asTestUser: 1, expectation: 2 })],
      "my first contract"
    ),

    // test2: Given.Default(
    //   [`hello`],
    //   [
    //     When.Increment(1),
    //     When.Increment(1),
    //     When.Increment(1),
    //     When.Increment(1),

    //     When.Decrement(1),
    //     When.Decrement(1),
    //     When.Decrement(1),
    //     When.Decrement(1),
    //   ],
    //   [Then.Get({ asTestUser: 1, expectation: 0 })],
    //   "my first contract"
    // ),
  };
};
