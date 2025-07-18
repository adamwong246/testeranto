export const specification = (Suite, Given, When, Then, Check) => [
    Suite.Default("BaseGiven Tests", {
        initialization: Given.Default(["Should initialize with default values"], [], [Then.verifyStore("initial")]),
        errorHandling: Given.WithError(["Should handle errors properly"], [When.throwError()], [Then.verifyError("Test error")])
    }),
    Suite.Default("BaseWhen Tests", {
        stateModification: Given.Default(["Should modify state correctly"], [When.modifyStore("modified")], [Then.verifyStore("modified")]),
        errorPropagation: Given.Default(["Should propagate errors"], [When.throwError()], [Then.verifyError("Test error")])
    }),
    Suite.Default("BaseThen Tests", {
        assertionPassing: Given.Default(["Should pass valid assertions"], [When.modifyStore("asserted")], [Then.verifyStore("asserted")]),
        assertionFailing: Given.Default(["Should fail invalid assertions"], [When.modifyStore("wrong")], [Then.verifyStore("right")] // This should fail
        )
    })
];
