"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterfacer = void 0;
const react_1 = require("react");
const testInterfacer = (testInput) => {
    return {
        beforeAll: async (prototype, artificer) => {
            return await new Promise((resolve, rej) => {
                resolve(null);
            });
        },
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve((0, react_1.createElement)(testInput));
            });
        },
        andWhen: async function (s, whenCB) {
            return s;
        },
        butThen: async function (s) {
            return s;
        },
        afterEach: async function (store, ndx, artificer) {
            return {};
        },
        afterAll: (store, artificer) => {
            return;
        },
    };
};
exports.testInterfacer = testInterfacer;
