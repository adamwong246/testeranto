# testeranto.ts
## teeny-tiny, tightly-typed typescript tests

Testeranto.ts a Typescript testing framework. It is a way of specifing stateful logic, lifting that knowledge out of your stakeholder's head and into a high-level strongly-typed specification. Testeranto can test any statefull code, from individual javascript classes to entire services, all with the gherkin-like syntax that we all know and love. Whre most testing frameworks focus either on the small-scale (unit tests) or the large-scale (integration tests, E2E tests), testeranto brings them all under 1 tent, providing 1 type interface for all your tests, big and small. 

Testeranto is NOT for testing stateless, or "pure", functions- it is designed only to address _stateful_ logic. Testeranto is made to test individual classes as well as more complex pieces of code but it's not designed to address stateless code. However, by carefully extending `TesterantoBasic`, you _can_ test functions- for instance, JSX functions. (See the React example)

## The good parts

Testeranto is just ~300 lines of Typescript with zero dependencies. You are free to use any other testing, or test-reporting, frameworks you'd like in conjunction.

Testeranto is not meant to _replace all_ tests. Rather, it's meant to _compliment any_ test. 

## The bad parts

Testeranto requires _some_ boilerplate_ but because of TS, much of this can be shared. Depending on your needs, you will need to implement an interface which extends 1 of 2 classes:
- `TesterantoClassic`, when you only need to test a class
- `TesterantoBasic`, when you need to test something more complex

## examples

### TesterantoClassic
- [Testing a class](/tests/Rectangle)

### TesterantoBasic
- [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
- [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
- [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)
