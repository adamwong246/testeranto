# testeranto.ts
## teeny tiny tightly-typed typescript tests

"Testeranto" (a pun based on the language "esperanto") is a Typescript testing framework. It is a way of specifing stateful logic, lifting that knowledge out of your codebase into a high-level cucumber-like specification. Testeranto is NOT for testing pure functions- it is designed only to address _stateful_ logic. 

Testeranto is pure typescript and adds zero dependencies. You are free to use any other testing, or test-reporting, frameworks you'd like in conjunction.

Testeranto is low on boilerplate. Typescript makes it very easy to implement your testeranto interfaces, of which you will need 1 for each class or type signature. Each will consist 4 simple classes, corresponding to Suite, Given, When, and Then cucumber steps. The tests themselves, which are nothing more than callbacks and assertions. 