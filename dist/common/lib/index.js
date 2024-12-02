"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTestResourceRequirement = exports.DefaultTestInterface = exports.BaseTestInterface = void 0;
// import { INodeUtils, ITestInterface, IUtils, IWebUtils } from "./types.js";
exports.BaseTestInterface = {
    beforeAll: async (s) => s,
    beforeEach: async function (subject, initialValues, testResource, pm) {
        return subject;
    },
    afterEach: async (s) => s,
    afterAll: (store) => undefined,
    butThen: async (store, thenCb) => thenCb(store),
    andWhen: (a) => a,
    assertThis: () => null,
};
const DefaultTestInterface = (p) => {
    return Object.assign(Object.assign({}, exports.BaseTestInterface), p);
};
exports.DefaultTestInterface = DefaultTestInterface;
exports.defaultTestResourceRequirement = {
    ports: 0,
};
