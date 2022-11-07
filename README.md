# testeranto.ts
## teeny tiny tightly-typed typescript tests

"testeranto" (a pun based on the language "esperanto") is a bespoke Typescript testing framework. It is a way of specifing stateful logic, lifting that knowledge out of your codebase into a high-level cucumber-like specification. Testeranto is NOT for testing pure functions- is designed only to address _stateful_ logic. 

1) Write your code. It can be a react component, a reselect selector or even are plain old class. 
2) Implement a testeranto interface for your component.
3) Write your tests in the pattern of Given/Whens/Thens
4) Run your tests!

Testeranto is pure typescript and adds zero dependencies. You are free to use any other testing, or test-reporting, frameworks you'd like in conjunction.

Testeranto is low on boilerplate. Typescript makes it very easy to implement your testeranto interfaces, of which you will need 1 for each class you wish to test. You'll need to implement 4 simple classes, corresponding to Suite, Given, When, and Then cucumber steps, as well as the tests themselves, which are nothing more than callbacks and assertions. 

Testeranto keeps you sane. 