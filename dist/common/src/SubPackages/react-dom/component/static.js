"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterfacer = void 0;
const react_1 = require("react");
const testInterfacer = (testInput) => {
    return {
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve((0, react_1.createElement)(testInput));
            });
        },
        andWhen: async function (s, whenCB) {
            return whenCB(s);
        },
        butThen: async function (s) {
            return s;
        },
        afterEach: async function () {
            return {};
        },
        afterAll: () => {
            return;
        },
    };
};
exports.testInterfacer = testInterfacer;
