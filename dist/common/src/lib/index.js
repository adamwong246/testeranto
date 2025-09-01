"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTestResourceRequirement = exports.DefaultAdapter = exports.BaseAdapter = void 0;
const BaseAdapter = () => ({
    beforeAll: async (input, testResource, pm) => {
        return input;
    },
    beforeEach: async function (subject, initializer, testResource, initialValues, pm) {
        return subject;
    },
    afterEach: async (store, key, pm) => Promise.resolve(store),
    afterAll: (store, pm) => undefined,
    butThen: async (store, thenCb, testResource, pm) => {
        return thenCb(store, pm);
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        return whenCB(store, pm);
    },
    assertThis: (x) => x,
});
exports.BaseAdapter = BaseAdapter;
const DefaultAdapter = (p) => {
    const base = (0, exports.BaseAdapter)();
    return Object.assign(Object.assign({}, base), p);
};
exports.DefaultAdapter = DefaultAdapter;
exports.defaultTestResourceRequirement = {
    ports: 0,
};
