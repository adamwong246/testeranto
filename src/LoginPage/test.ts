import { ITestSpecification } from "testeranto/src/Types";

export type ILoginPageSpecs = {

  iinput: any,
  isubject: any,
  istore: any,
  iselection: any,

  when: void,
  then: unknown,
  given: (x) => unknown,

  suites: {
    Default: string;
  },
  givens: {
    default: []
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
    ThereIsAnEmailError: [];
    ThereIsNotAnEmailError: [];
  };
  checks: {
    default;
  }
};

export const LoginPageSpecs: ITestSpecification<
  ILoginPageSpecs
> = (
  Suite,
  Given,
  When,
  Then,
  Check
) => {
    return [
      Suite.Default(
        "Testing the LoginPage as react",
        {
          "test0": Given.default(
            [],
            [
              When.TheEmailIsSetTo("adam@email.com")
            ],
            [
              Then.TheEmailIs("adam@email.com")
            ]
          ),
          "test1": Given.default(
            [],
            [
              When.TheEmailIsSetTo("adam@email.com"),
              When.ThePasswordIsSetTo("secret"),
            ],
            [
              Then.TheEmailIsNot("wade@rpc"),
              Then.TheEmailIs("adam@email.com"),
              Then.ThePasswordIs("secret"),
              Then.ThePasswordIsNot("idk"),
            ]
          ),
          "test2": Given.default(
            [],
            [When.TheEmailIsSetTo("adam")],
            [Then.ThereIsNotAnEmailError()]
          ),
          "test3": Given.default(
            [],
            [
              When.TheEmailIsSetTo("bob"),
              When.TheLoginIsSubmitted()
            ],
            [Then.ThereIsAnEmailError()]
          ),
          "test4": Given.default(
            [],
            [
              When.TheEmailIsSetTo("adam@mail.com"),
              When.ThePasswordIsSetTo("foso")],
            [
              Then.ThereIsNotAnEmailError()
            ]
          )
        },
        []
      ),
    ];
  }

