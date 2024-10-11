export type IMyFirstContractTestSpecification = {
  suites: {
    Default;
  };
  givens: {
    Default;
  };
  whens: {
    Increment: [number];
    Decrement: [number];
  };
  thens: {
    Get: [{ asTestUser: number, expectation: number }];
  };
  checks: {
    AnEmptyState: [];
  };
}

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
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
        When.Increment(1),
      ],
      [
        Then.Get({ asTestUser: 1, expectation: 16 })
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
        When.Decrement(1),
        When.Decrement(1),
        When.Decrement(1),
      ],
      [
        Then.Get({ asTestUser: 1, expectation: 0 })
      ],
      "my first contract"
    ),

  };
}
