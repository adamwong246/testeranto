"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
exports.testInterface = {
    beforeAll: async () => { },
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
    assertThis: (x) => { }
};
