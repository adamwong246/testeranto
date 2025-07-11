"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTestResourceRequirement = exports.DefaultTestInterface = exports.BaseTestInterface = void 0;
const BaseTestInterface = () => ({
    beforeAll: async (s) => s,
    beforeEach: async function (subject, initialValues, x, testResource, pm) {
        return subject;
    },
    afterEach: async (s) => s,
    afterAll: (store) => undefined,
    butThen: async (store, thenCb) => {
        return thenCb(store);
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        try {
            await whenCB(store, testResource, pm);
        }
        catch (error) {
            console.error("Error in andWhen:", error);
            throw error; // Re-throw to maintain test failure
        }
    },
    assertThis: (x) => x,
});
exports.BaseTestInterface = BaseTestInterface;
const DefaultTestInterface = (p) => {
    return Object.assign(Object.assign({}, exports.BaseTestInterface), p);
};
exports.DefaultTestInterface = DefaultTestInterface;
exports.defaultTestResourceRequirement = {
    ports: 0,
};
