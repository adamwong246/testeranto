# testeranto.ts
## teeny-tiny, tightly-typed typescript tests™
### "It's like cucumber, but for typescript."
---

```ts
const LoginPageTesteranto = new ReactTesteranto<
  {
    Default: (givens: ReactGiven[]) => ReactSuite
  },
  {
    AnEmptyState: (feature: string, whens: ReactWhen[], thens: ReactThen[]) => ReactGiven
  },
  {
    TheEmailIsSetTo: (email: string) => ReactWhen,

  },
  {
    TheEmailIs: (email: string) => ReactThen,
  }
>(
  {
    Default: (description, component, givens) =>
      new ReactSuite(description, component, givens)

  },
  {
    AnEmptyState: (feature, whens, thens, x) =>
      new ReactGiven(`the state is empty`, whens, thens, feature),
  },
  {
    TheEmailIsSetTo: (email) => new ReactWhen(`the email is set to "${email}"`, (component) => {
      component.root.findByProps({ type: "email" }).props.onChange({ target: { value: email } });
    })
  },
  {
    TheEmailIs: (email) =>
      new ReactThen(
        `the email is "${email}"`,
        (component) => {
          assert.equal(
            component.root.findByProps({ type: "email" }).props.value,
            email
          )
        }
      ),
  }
)

const LoginPageSuite = LoginPageTesteranto.Suites().Default;
const Given = LoginPageTesteranto.Given();
const When = LoginPageTesteranto.When();
const Then = LoginPageTesteranto.Then();

export default () => {
  LoginPageSuite('testing a JSX component', LoginPage, [
    Given.AnEmptyState(`Set the email and check the email`, [
      When.TheEmailIsSetTo("adam@email.com"),
    ], [
      Then.TheEmailIs("adam@email.com"),
    ]),
  ]).test();
}

```

```
Suite: testing a JSX component

 - Set the email and check the email -

Given: the state is empty
 When: the email is set to "adam@email.com"
 Then: the email is "adam@email.com"
```

### about
Testeranto.ts a Typescript testing framework, akin to mocha, jasmine or jest. Unlike those projects, testeranto focuses on _specifing stateful logic with strong type bindings using a gherkin syntax_. 

### the good parts
Testeranto can test any statefull typescript, from individual classes to entire services, with the given-when-then format that we all know and love, and all without any dependencies- testeranto.ts is comprised entirely of ~300 lines of typescript. 

### the bad parts
You will need to implement your own test infrastructure. Depending on your needs, you will need to implement an interface which extends 1 of 2 classes:

- `TesterantoClassic`, when you only need to test a class
  - [Testing a class](/tests/Rectangle)

- `TesterantoBasic`, when you need to test something more complex
  - [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
  - [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
  - [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)
