"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
const testInterface = (testInput) => {
    return {
        beforeEach: async (x, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                resolve(testInput());
            });
        },
        andWhen: function (s, actioner) {
            return actioner()(s);
        },
    };
};
exports.testInterface = testInterface;
