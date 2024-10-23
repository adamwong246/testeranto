import { ITestImplementation, ITestSpecification } from "testeranto/src/Types";

import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
} from "@reduxjs/toolkit";

import { IStoreState } from "./app";

export type IAppSpecification = {
  iinput: any;
  isubject: any;
  istore: any;
  iselection: IStoreState;

  when: (
    a: any
  ) => [
    (
      | ActionCreatorWithNonInferrablePayload<string>
      | ActionCreatorWithoutPayload<string>
    ),
    unknown?
  ];
  then: any;
  // given: IStoreState,
  given: IStoreState;

  suites: {
    Default: [string];
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

export type IImplementation = ITestImplementation<
  IAppSpecification,
  {
    givens: {
      [K in keyof IAppSpecification["givens"]]: (
        ...Iw: IAppSpecification["givens"][K]
      ) => (x) => IStoreState;
    };
    // whens: {
    //   [K in keyof IAppSpecification["whens"]]: (
    //     ...Iw: IAppSpecification["whens"][K]
    //   ) => [
    //       (
    //         | ActionCreatorWithNonInferrablePayload<string>
    //         | ActionCreatorWithoutPayload<string>
    //       )
    //       , unknown?];
    // }
    checks: {
      [K in keyof IAppSpecification["checks"]]: (
        ...Iw: IAppSpecification["checks"][K]
      ) => (x) => IStoreState;
    };
  }
>;

export const AppSpecification: ITestSpecification<IAppSpecification> = (
  Suite,
  Given,
  When,
  Then,
  Check
) => {
  return [
    Suite.Default(
      "Testing the Redux store",
      {
        test0: Given.AnEmptyState(
          ["hello"],
          [When.TheEmailIsSetTo("adam@email.com")],
          [Then.TheEmailIs("adam@email.com")]
        ),
        test1: Given.AStateWithEmail(
          ["hello"],
          [],
          [
            Then.TheEmailIsNot("adam@email.com"),
            Then.TheEmailIs("bob@mail.com"),
          ],
          "bob@mail.com"
        ),
        test2: Given.AnEmptyState(
          ["hello"],
          [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
          [Then.TheEmailIs("aloha")]
        ),
        test3: Given.AnEmptyState(
          [`aloha`, `hello`],
          [],
          [Then.TheEmailIs("")]
        ),
        test4: Given.AnEmptyState(
          [`aloha`, `hello`],
          [When.TheEmailIsSetTo("hey there")],
          [Then.TheEmailIs("hey there")]
        ),
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
