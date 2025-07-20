"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdapter = void 0;
exports.testAdapter = {
    beforeEach: async (subject, initializer) => initializer(),
    andWhen: async (store, whenCB) => whenCB(store),
    butThen: async (store, thenCB) => thenCB(store),
    afterEach: (store) => store,
    afterAll: () => { },
    assertThis: (result) => !!result,
    beforeAll: async (input) => input,
};
