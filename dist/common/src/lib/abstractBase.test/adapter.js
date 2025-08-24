"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdapter = void 0;
exports.testAdapter = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        const result = await initializer();
        // Ensure the result matches the expected type
        if (typeof result === "function") {
            // If it's a function, call it to get the actual store
            return result();
        }
        return result;
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        return whenCB(store);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        return thenCB(store);
    },
    afterEach: async (store, key, pm) => Promise.resolve(store),
    afterAll: async (store, pm) => { },
    assertThis: (result) => !!result,
    beforeAll: async (input, testResource, pm) => input,
};
