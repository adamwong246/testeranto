const myFeature = `hello`;

export type IServerTestSpecifications = {
  suites: {
    Default: string;
  };
  givens: {
    AnEmptyState: [];
  };
  whens: {
    PostToStatus: [string];
    PostToAdd: [number];
  };
  thens: {
    TheStatusIs: [string];
    TheNumberIs: [number];
  };
  checks: {
    AnEmptyState;
  };
};

export const ServerTestImplementation = {
  Suites: {
    Default: "some default Suite"
  },
  Givens: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    },
  },
  Whens: {
    PostToStatus: (status: string): [any, any] => ["put_status", status],
    PostToAdd: (n: number): [any, any] => ["put_number", n.toString()],
  },
  Thens: {
    TheStatusIs: (status: string) => (): [any, any] => ["get_status", status],
    TheNumberIs: (number: number) => (): [any, any] => ["get_number", number],
  },
  Checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    },
  },
};

export const ServerTestSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Node server with fetch!",
      {
        "test0": Given.AnEmptyState(
          [myFeature],
          [],
          [Then.TheStatusIs("some great status")]
        ),
        "test1": Given.AnEmptyState(
          [myFeature],
          [
            When.PostToStatus("1"),
            When.PostToStatus("2"),
            When.PostToStatus("3"),
            When.PostToStatus("4"),
            When.PostToStatus("5"),
            When.PostToStatus("6"),
            When.PostToStatus("hello")],
          [Then.TheStatusIs("hello")]
        ),
        "test2": Given.AnEmptyState(
          [myFeature],
          [When.PostToStatus("hello"), When.PostToStatus("aloha")],
          [Then.TheStatusIs("aloha")]
        ),
        "test2.5": Given.AnEmptyState(
          [myFeature],
          [When.PostToStatus("hola")],
          [Then.TheStatusIs("hola")]
        ),
        "test3": Given.AnEmptyState(
          [myFeature],
          [],
          [
            Then.TheNumberIs(0)
          ]
        ),
        "test5": Given.AnEmptyState(
          [myFeature],
          [When.PostToAdd(1), When.PostToAdd(2)],
          [Then.TheNumberIs(3)]
        ),
        "test6": Given.AnEmptyState(
          [myFeature],
          [
            When.PostToStatus("aloha"),
            When.PostToAdd(4),
            When.PostToStatus("hello"),
            When.PostToAdd(3),
          ],
          [Then.TheStatusIs("hello"), Then.TheNumberIs(7)]
        )
      }, []

      // [
      // // Check.AnEmptyState(
      // //   "HTTP imperative style",
      // //   async ({ PostToAdd }, { TheNumberIs }) => {
      // //     await PostToAdd(2);
      // //     await PostToAdd(3);
      // //     await TheNumberIs(5);
      // //     await PostToAdd(2);
      // //     await TheNumberIs(7);
      // //     await PostToAdd(3);
      // //     await TheNumberIs(10);
      // //   }
      // // ),
      // // Check.AnEmptyState(
      // //   "HTTP imperative style II",
      // //   async ({ PostToAdd }, { TheNumberIs }) => {
      // //     const a = await PostToAdd(2);
      // //     const b = parseInt(await PostToAdd(3));
      // //     await TheNumberIs(b);
      // //     await PostToAdd(2);
      // //     await TheNumberIs(7);
      // //     await PostToAdd(3);
      // //     await TheNumberIs(10);
      // //     assert.equal(await PostToAdd(-15), -5);
      // //     await TheNumberIs(-5);
      // //   }
      // // ),
      // ]
    ),
  ];
}