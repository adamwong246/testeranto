"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdapter = void 0;
exports.testAdapter = {
    beforeEach: async (subject, initializer) => {
        return initializer();
    },
    andWhen: async (store, whenCB, testResource, utils) => {
        return whenCB(store, utils);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        return thenCB(store, pm);
    },
    afterEach: (store) => store,
    afterAll: () => { },
    assertThis: (x) => { },
};
