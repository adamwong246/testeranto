import { assert } from "chai";
import features from "../testerantoFeatures.test";
import { ReduxTesteranto } from "./redux.testeranto.test";
import { IStoreState, loginApp } from "./app";

const myFeature = features.hello;

export const AppReduxTesteranto = ReduxTesteranto<
  IStoreState,
  {
    suites: {
      Default: string;
    };
    givens: {
      AnEmptyState: [];
      AStateWithEmail: [string];
    };
    whens: {
      TheLoginIsSubmitted;
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
  }
>(
  {
        Suites: {
          Default: "some default Suite",
        },
        Givens: {
          AnEmptyState: () => {
            return loginApp.getInitialState();
          },
          AStateWithEmail: (email) => {
            return { ...loginApp.getInitialState(), email };
          },
        },
        Whens: {
          TheLoginIsSubmitted: () => () => [loginApp.actions.signIn],
          TheEmailIsSetTo: (email) => () => [loginApp.actions.setEmail, email],
          ThePasswordIsSetTo: (password) => () =>
            [loginApp.actions.setPassword, password],
        },
        Thens: {
          TheEmailIs: (email) => (storeState) =>
            assert.equal(storeState.email, email),
          TheEmailIsNot: (email) => (storeState) =>
            assert.notEqual(storeState.email, email),
          ThePasswordIs: (password) => (selection) =>
            assert.equal(selection.password, password),
          ThePasswordIsNot: (password) => (selection) =>
            assert.notEqual(selection.password, password),
        },
        Checks: {
          AnEmptyState: () => loginApp.getInitialState(),
        },
      },

      (Suite, Given, When, Then, Check) => {
        return [
          Suite.Default(
            "Testing the Redux store",
            [
              Given.AnEmptyState(
                "BDD gherkin style",
                [features.hello],
                [
                  When.TheEmailIsSetTo("adam@email.com")
                ],
                [
                  Then.TheEmailIs("adam@email.com")
                ]
              ),
              // Given.AStateWithEmail(
              //   "another feature",
              //   [features.hello],
              //   [],
              //   [
              //     Then.TheEmailIsNot("adam@email.com"),
              //     Then.TheEmailIs("bob@mail.com"),
              //   ],
              //   "bob@mail.com"
              // ),
              // Given.AnEmptyState(
              //   "yet another feature",
              //   [features.hello],
              //   [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
              //   [Then.TheEmailIs("aloha")]
              // ),
              // Given.AnEmptyState(
              //   "OMG a feature!",
              //   [features.aloha, features.hello],
              //   [],
              //   [Then.TheEmailIs("")]
              // ),
            ],
            [
              // Check.AnEmptyState(
              //   "imperative style",
              //   [features.aloha],
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
      loginApp.reducer

);


// export class ServerHttpTesteranto extends HttpTesteranto<
//   {
//     suites: {
//       Default: string;
//     };
//     givens: {
//       AnEmptyState: [];
//     };
//     whens: {
//       PostToStatus: [string];
//       PostToAdd: [number];
//     };
//     thens: {
//       TheStatusIs: [string];
//       TheNumberIs: [number];
//     };
//     checks: {
//       AnEmptyState;
//     };
//   },
//   any
// > {
//   constructor() {
//     super(
//       {
//         Suites: {
//           Default: "some default Suite",
//         },
//         Givens: {
//           /* @ts-ignore:next-line */
//           AnEmptyState: () => {
//             return {};
//           },
//         },
//         Whens: {
//           PostToStatus: (status: string) => () => {
//             return ["put_status", status];
//           },
//           PostToAdd: (n: number) => () => ["put_number", n.toString()],
//         },
//         Thens: {
//           TheStatusIs: (status: string) => () => ["get_status", status],
//           TheNumberIs: (number: number) => () => ["get_number", number],
//         },
//         Checks: {
//           /* @ts-ignore:next-line */
//           AnEmptyState: () => {
//             return {};
//           },
//         },
//       },

//       (Suite, Given, When, Then, Check) => {
//         return [
//           Suite.Default(
//             "Testing the Node server with fetch",
//             [
//               Given.AnEmptyState(
//                 "a http boringfeature",
//                 [myFeature],
//                 [],
//                 [Then.TheStatusIs("some great status")]
//               ),
//               Given.AnEmptyState(
//                 "a http feature",
//                 [myFeature],
//                 [When.PostToStatus("hello")],
//                 [Then.TheStatusIs("hello")]
//               ),
//               Given.AnEmptyState(
//                 "a httpfeature",
//                 [myFeature],
//                 [When.PostToStatus("hello"), When.PostToStatus("aloha")],
//                 [Then.TheStatusIs("aloha")]
//               ),
//               Given.AnEmptyState(
//                 "a feature",
//                 [myFeature],
//                 [],
//                 [Then.TheNumberIs(0)]
//               ),
//               Given.AnEmptyState(
//                 "a httpfeature",
//                 [myFeature],
//                 [When.PostToAdd(1), When.PostToAdd(2)],
//                 [Then.TheNumberIs(3)]
//               ),
//               Given.AnEmptyState(
//                 "another http feature",
//                 [myFeature],
//                 [
//                   When.PostToStatus("aloha"),
//                   When.PostToAdd(4),
//                   When.PostToStatus("hello"),
//                   When.PostToAdd(3),
//                 ],
//                 [Then.TheStatusIs("hello"), Then.TheNumberIs(7)]
//               ),
//             ],
//             [
//               // Check.AnEmptyState(
//               //   "HTTP imperative style",
//               //   async ({ PostToAdd }, { TheNumberIs }) => {
//               //     await PostToAdd(2);
//               //     await PostToAdd(3);
//               //     await TheNumberIs(5);
//               //     await PostToAdd(2);
//               //     await TheNumberIs(7);
//               //     await PostToAdd(3);
//               //     await TheNumberIs(10);
//               //   }
//               // ),
//               // Check.AnEmptyState(
//               //   "HTTP imperative style II",
//               //   async ({ PostToAdd }, { TheNumberIs }) => {
//               //     const a = await PostToAdd(2);
//               //     const b = parseInt(await PostToAdd(3));
//               //     await TheNumberIs(b);
//               //     await PostToAdd(2);
//               //     await TheNumberIs(7);
//               //     await PostToAdd(3);
//               //     await TheNumberIs(10);
//               //     assert.equal(await PostToAdd(-15), -5);
//               //     await TheNumberIs(-5);
//               //   }
//               // ),
//             ]
//           ),
//         ];
//       },

//       serverFactory
//     );
//   }
// }





// export class AppReduxTesteranto extends ReduxTesteranto<
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
//       TheLoginIsSubmitted;
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
//   }
// > {
//   constructor() {
//     super(
//       {
//         Suites: {
//           Default: "some default Suite",
//         },
//         Givens: {
//           AnEmptyState: () => {
//             return loginApp.getInitialState();
//           },
//           AStateWithEmail: (email) => {
//             return { ...loginApp.getInitialState(), email };
//           },
//         },
//         Whens: {
//           TheLoginIsSubmitted: () => () => [loginApp.actions.signIn],
//           TheEmailIsSetTo: (email) => () => [loginApp.actions.setEmail, email],
//           ThePasswordIsSetTo: (password) => () =>
//             [loginApp.actions.setPassword, password],
//         },
//         Thens: {
//           TheEmailIs: (email) => (storeState) =>
//             assert.equal(storeState.email, email),
//           TheEmailIsNot: (email) => (storeState) =>
//             assert.notEqual(storeState.email, email),
//           ThePasswordIs: (password) => (selection) =>
//             assert.equal(selection.password, password),
//           ThePasswordIsNot: (password) => (selection) =>
//             assert.notEqual(selection.password, password),
//         },
//         Checks: {
//           AnEmptyState: () => loginApp.getInitialState(),
//         },
//       },

//       (Suite, Given, When, Then, Check) => {
//         return [
//           Suite.Default(
//             "Testing the Redux store",
//             [
//               Given.AnEmptyState(
//                 "BDD gherkin style",
//                 [features.hello],
//                 [When.TheEmailIsSetTo("adam@email.com")],
//                 [Then.TheEmailIs("adam@email.com")]
//               ),
//               Given.AStateWithEmail(
//                 "another feature",
//                 [features.hello],
//                 [],
//                 [
//                   Then.TheEmailIsNot("adam@email.com"),
//                   Then.TheEmailIs("bob@mail.com"),
//                 ],
//                 "bob@mail.com"
//               ),
//               Given.AnEmptyState(
//                 "yet another feature",
//                 [features.hello],
//                 [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
//                 [Then.TheEmailIs("aloha")]
//               ),
//               Given.AnEmptyState(
//                 "OMG a feature!",
//                 [features.aloha, features.hello],
//                 [],
//                 [Then.TheEmailIs("")]
//               ),
//             ],
//             [
//               Check.AnEmptyState(
//                 "imperative style",
//                 [features.aloha],
//                 async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
//                   await TheEmailIsSetTo("foo");
//                   await TheEmailIs("foo");
//                   const reduxPayload = await TheEmailIsSetTo("foobar");
//                   await TheEmailIs("foobar");
//                   // assert.deepEqual(reduxPayload, {
//                   //   type: "login app/setEmail",
//                   //   payload: "foobar",
//                   // });
//                 }
//               ),
//             ]
//           ),
//         ];
//       },
//       loginApp.reducer
//     );
//   }
// }
