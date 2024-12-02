import { BaseBuilder } from "./basebuilder.js";
export class ClassBuilder extends BaseBuilder {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement
    // puppetMaster: PM
    ) {
        const classySuites = Object.entries(testImplementation.suites).reduce((a, [key], index) => {
            a[key] = (somestring, givens, checks) => {
                return new suiteKlasser.prototype.constructor(somestring, index, givens, checks);
            };
            return a;
        }, {});
        const classyGivens = Object.entries(testImplementation.givens).reduce((a, [key, givEn]) => {
            a[key] = (features, whens, thens, givEn) => {
                return new givenKlasser.prototype.constructor(key, features, whens, thens, testImplementation.givens[key], givEn);
            };
            return a;
        }, {});
        const classyWhens = Object.entries(testImplementation.whens).reduce((a, [key, whEn]) => {
            a[key] = (payload) => {
                return new whenKlasser.prototype.constructor(`${whEn.name}: ${payload && payload.toString()}`, whEn(payload));
            };
            return a;
        }, {});
        const classyThens = Object.entries(testImplementation.thens).reduce((a, [key, thEn]) => {
            a[key] = (expected, x) => {
                return new thenKlasser.prototype.constructor(`${thEn.name}: ${expected && expected.toString()}`, thEn(expected));
            };
            return a;
        }, {});
        const classyChecks = Object.entries(testImplementation.checks).reduce((a, [key, z]) => {
            a[key] = (somestring, features, callback) => {
                return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
            };
            return a;
        }, {});
        super(input, classySuites, classyGivens, classyWhens, classyThens, classyChecks, testResourceRequirement, testSpecification
        // puppetMaster
        );
    }
}
