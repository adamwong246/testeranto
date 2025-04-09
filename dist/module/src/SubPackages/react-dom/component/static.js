import { createElement } from "react";
export const testInterfacer = (testInput) => {
    return {
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(createElement(testInput));
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
