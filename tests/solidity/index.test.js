// import { MyFirstContractTesteranto } from "./MyFirstContract.test";
// (async () => {
//   await new MyFirstContractTesteranto()[0].runner({ port: 3001 })
// })()
export const commonGivens = (Given, When, Then, features) => [
    Given.Default([`hello`], [], [
        Then.Get({ asTestUser: 1, expectation: 0 })
    ], "my first contract"),
    Given.Default([`hello`], [
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
    ], [
        Then.Get({ asTestUser: 1, expectation: 4 })
    ], "my first contract"),
    Given.Default([`hello`], [
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Decrement(1),
    ], [
        Then.Get({ asTestUser: 1, expectation: 3 })
    ], "my first contract"),
    // Given.Default(
    //   [`hello`],
    //   [
    //     When.Decrement(1),
    //     When.Decrement(1),
    //     When.Decrement(1),
    //     When.Increment(1),
    //     When.Increment(1),
    //   ],
    //   [
    //     Then.Get({ asTestUser: 1, expectation: 1.157920892373162e+77 })
    //   ],
    //   "this test should fail"
    // ),
];
