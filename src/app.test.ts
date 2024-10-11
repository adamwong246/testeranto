import {
  ITestSpecification,
} from "testeranto/src/Types";

export type IAppSpecification = {
  suites: {
    Default: string;
  };
  givens: {
    AnEmptyState: [];
    AStateWithEmail: [string];
  };
  whens: {
    TheLoginIsSubmitted: [];
    TheEmailIsSetTo: [string];
    ThePasswordIsSetTo: [string];
  };
  thens: {
    TheEmailIs: [string];
    TheEmailIsNot: [string];
    ThePasswordIs: [string];
    ThePasswordIsNot: [string];
  };
  checks: {
    AnEmptyState: [];
  };
};

export const AppSpecification: ITestSpecification<
  IAppSpecification,
  any,
  any,
  any,
  any,
  any,
  any
> = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Redux store",
      {
        "test0": Given.AnEmptyState(
          ['hello'],
          [When.TheEmailIsSetTo("adam@email.com")],
          [Then.TheEmailIs("adam@email.com")],
        ),
        "test1": Given.AStateWithEmail(
          ['hello'],
          [],
          [
            Then.TheEmailIsNot("adam@email.com"),
            Then.TheEmailIs("bob@mail.com"),
          ],
          "bob@mail.com"
        ),
        "test2": Given.AnEmptyState(
          ['hello'],
          [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
          [Then.TheEmailIs("aloha")]
        ),
        "test3": Given.AnEmptyState(
          [`aloha`, `hello`],
          [],
          [Then.TheEmailIs("")]
        ),
        "test4": Given.AnEmptyState(
          [`aloha`, `hello`],
          [When.TheEmailIsSetTo("hey there")],
          [Then.TheEmailIs("hey there")]
        )
      },
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
};

// export const AppImplementation = {
//   suites: {
//     Default: "some default Suite",
//   },
//   givens: {
//     AnEmptyState: () => {
//       return loginApp.getInitialState();
//     },
//     AStateWithEmail: (email) => {
//       return { ...loginApp.getInitialState(), email };
//     },
//   },
//   whens: {
//     TheLoginIsSubmitted: () => [loginApp.actions.signIn],
//     TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
//     ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password],
//   },
//   thens: {
//     TheEmailIs: (email) => (storeState) =>
//       assert.equal(storeState.email, email),
//     TheEmailIsNot: (email) => (storeState) =>
//       assert.notEqual(storeState.email, email),
//     ThePasswordIs: (password) => (selection) =>
//       assert.equal(selection.password, password),
//     ThePasswordIsNot: (password) => (selection) =>
//       assert.notEqual(selection.password, password),
//   },
//   checks: {
//     AnEmptyState: () => loginApp.getInitialState(),
//   },
// } as Modify<ITestImplementation<
//   IStoreState,
//   IStoreState,
//   WhenShape,
//   ThenShape,
//   IAppSpecification
// >, {
//   whens: {
//     [K in keyof IAppSpecification["whens"]]: (
//       ...Iw: IAppSpecification["whens"][K]
//     ) => WhenShape;
//   }
// }>;
// export const AppReduxTesteranto = ReduxTesteranto<
//   IStoreState,
//   {
//     suites: {
//       Default: string;
//     };
//     givens: {
//       AnEmptyState: [];
//       AStateWithEmail: [string];
//     };
//     whens: {
//       TheLoginIsSubmitted: [];
//       TheEmailIsSetTo: [string];
//       ThePasswordIsSetTo: [string];
//     };
//     thens: {
//       TheEmailIs: [string];
//       TheEmailIsNot: [string];
//       ThePasswordIs: [string];
//       ThePasswordIsNot: [string];
//     };
//     checks: {
//       AnEmptyState: [];
//     };
//   },
//   typeof loginApp
// >(
//   {
//     suites: {
//       Default: "some default Suite",
//     },
//     givens: {
//       AnEmptyState: () => {
//         return loginApp.getInitialState();
//       },
//       AStateWithEmail: (email) => {
//         return { ...loginApp.getInitialState(), email };
//       },
//     },
//     whens: {
//       TheLoginIsSubmitted: () => [loginApp.actions.signIn],
//       TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
//       ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password],
//     },
//     thens: {
//       TheEmailIs: (email) => (storeState) =>
//         assert.equal(storeState.email, email),
//       TheEmailIsNot: (email) => (storeState) =>
//         assert.notEqual(storeState.email, email),
//       ThePasswordIs: (password) => (selection) =>
//         assert.equal(selection.password, password),
//       ThePasswordIsNot: (password) => (selection) =>
//         assert.notEqual(selection.password, password),
//     },
//     checks: {
//       AnEmptyState: () => loginApp.getInitialState(),
//     },
//   },

//   (Suite, Given, When, Then, Check) => {
//     return [
//       Suite.Default(
//         "Testing the Redux store",
//         {
//           "test0": Given.AnEmptyState(
//             ['hello'],
//             [When.TheEmailIsSetTo("adam@email.com")],
//             [Then.TheEmailIs("adam@email.com")],
//           ),
//           "test1": Given.AStateWithEmail(
//             ['hello'],
//             [],
//             [
//               Then.TheEmailIsNot("adam@email.com"),
//               Then.TheEmailIs("bob@mail.com"),
//             ],
//             "bob@mail.com"
//           ), "test2": Given.AnEmptyState(
//             ['hello'],
//             [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
//             [Then.TheEmailIs("aloha")]
//           ), "test3": Given.AnEmptyState(
//             [`aloha`, `hello`],
//             [],
//             [Then.TheEmailIs("")]
//           ), "test4": Given.AnEmptyState(
//             [`aloha`, `hello`],
//             [When.TheEmailIsSetTo("hey there")],
//             [Then.TheEmailIs("hey there")]
//           )
//         },
//         [
//           // Check.AnEmptyState(
//           //   "imperative style",
//           //   [`aloha`],
//           //   async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
//           //     await TheEmailIsSetTo("foo");
//           //     await TheEmailIs("foo");
//           //     const reduxPayload = await TheEmailIsSetTo("foobar");
//           //     await TheEmailIs("foobar");
//           //     // assert.deepEqual(reduxPayload, {
//           //     //   type: "login app/setEmail",
//           //     //   payload: "foobar",
//           //     // });
//           //   }
//           // ),
//         ]
//       ),
//     ];
//   },
//   loginApp.reducer
// );
