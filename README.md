# testeranto.ts
## teeny-tiny, tightly-typed typescript tests

Testeranto.ts a Typescript testing framework. It is a way of specifing stateful logic, lifting that knowledge out of your stakeholder's head and into a high-level strongly-typed specification. Testeranto can test any statefull code, from individual javascript classes to entire services, all with the gherkin-like syntax that we all know and love. Whre most testing frameworks focus either on the small-scale (unit tests) or the large-scale (integration tests, E2E tests), testeranto brings them under 1 tent, providing 1 type interface for all your tests, big and small. 

Testeranto is NOT for testing stateless functions- it is designed only to address _stateful_ logic.  However, by carefully extending `TesterantoBasic`, you _can_ test wrap your functions- for instance, JSX functions. (See the React example)

## Rationale

There is a flaw in the heart of Javascript, a flaw that not even Typescript can help us solve. The problem is this: **it's not possible to know if a function is "pure".** It is not possible for the developer, or the transpiler, to know if function causes side-effects, and if it is dependent on something beyond the specified parameters. Typescript lets us know what _ought_ be returned, but it can't tell us if _something else_ was effected along the way. We must live with the fact that every function *might not be pure*.

Testeranto is my answer to that problem. Since we cannot enforce this purity at the level of the javascript code, nor can we enforce it at the level of the the type signatures, we must enforce it in the tests. By wrapping our code in a testeranto interface, we can divide an our code into 2 sets- state-changing "whens" (aka stately) and state-inspecting "thens" (aka pure)- and then testing them accordingly. 

## The good parts

Testeranto is just ~300 lines of Typescript with zero dependencies. You are free to use any other testing, or test-reporting, frameworks you'd like in conjunction.

Testeranto is not meant to _replace all_ tests. Rather, it's meant to _compliment any_ test. 

## The bad parts

Testeranto requires _some_ boilerplate but because of TS, much of this can be shared. Depending on your needs, you will need to implement an interface which extends 1 of 2 classes:
- `TesterantoClassic`, when you only need to test a class
- `TesterantoBasic`, when you need to test something more complex

Testeranto does not optimize for performance. 

## examples

### TesterantoClassic
- [Testing a class](/tests/Rectangle)

### TesterantoBasic
- [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
- [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
- [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)
