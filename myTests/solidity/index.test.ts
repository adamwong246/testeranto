export const commonGivens = (Given, When, Then, features) => {
  return {
    "test0": Given.Default(
      [`hello`],
      [],
      [
        Then.Get({ asTestUser: 1, expectation: 0 })
      ],
      "my first contract"
    ),

    "test1": Given.Default(
      [`hello`],
      [
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
      ],
      [
        Then.Get({ asTestUser: 1, expectation: 4 })
      ],
      "my first contract"
    ),

    "test2": Given.Default(
      [`hello`],
      [
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Decrement(1),
      ],
      [
        Then.Get({ asTestUser: 1, expectation: 3 })
      ],
      "my first contract"
    ),

    // "test3": Given.Default(
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
    // )
  };
}
