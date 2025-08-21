/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseBuilder } from "./basebuilder.js";
export class ClassBuilder extends BaseBuilder {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, testResourceRequirement) {
        const classySuites = Object.entries(testImplementation.suites).reduce((a, [key], index) => {
            a[key] = (somestring, givens) => {
                return new suiteKlasser.prototype.constructor(somestring, index, givens);
            };
            return a;
        }, {});
        const classyGivens = Object.entries(testImplementation.givens).reduce((a, [key, g]) => {
            a[key] = (features, whens, thens, ...initialValues) => {
                return new givenKlasser.prototype.constructor(key, features, whens, thens, testImplementation.givens[key], initialValues);
            };
            return a;
        }, {});
        const classyWhens = Object.entries(testImplementation.whens).reduce((a, [key, whEn]) => {
            a[key] = (...payload) => {
                return new whenKlasser.prototype.constructor(`${key}: ${payload && payload.toString()}`, whEn(...payload));
            };
            return a;
        }, {});
        const classyThens = Object.entries(testImplementation.thens).reduce((a, [key, thEn]) => {
            a[key] = (...args) => {
                return new thenKlasser.prototype.constructor(`${key}: ${args && args.toString()}`, thEn(...args));
            };
            return a;
        }, {});
        super(input, classySuites, classyGivens, classyWhens, classyThens, testResourceRequirement, testSpecification);
    }
}
