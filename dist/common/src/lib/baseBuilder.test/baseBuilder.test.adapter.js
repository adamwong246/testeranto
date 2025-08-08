"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdapter = void 0;
exports.testAdapter = {
    beforeAll: async (input, testResource, pm) => input,
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        const result = initializer();
        console.log("Initialization result:", JSON.stringify(result, null, 2));
        return result;
    },
    andWhen: async (store, whenCB, testResource, utils) => {
        return whenCB(store, utils);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        return thenCB(store, pm);
    },
    afterEach: (store) => store,
    afterAll: () => { },
    assertThis: (x) => x,
};
