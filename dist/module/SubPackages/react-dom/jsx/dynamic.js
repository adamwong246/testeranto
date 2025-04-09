import { createElement } from "react";
export const testInterfacer = (testInput) => {
    return {
        beforeAll: async (prototype, artificer) => {
            return await new Promise((resolve, rej) => {
                resolve(null);
            });
        },
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(createElement(testInput));
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
