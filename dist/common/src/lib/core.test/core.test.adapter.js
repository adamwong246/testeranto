"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdapter = void 0;
const MockCore_1 = require("./MockCore");
exports.testAdapter = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        var _a;
        try {
            const result = await initializer();
            if (!result) {
                throw new Error("Initializer returned undefined");
            }
            if (!(result instanceof MockCore_1.MockCore)) {
                throw new Error(`Initializer returned ${(_a = result === null || result === void 0 ? void 0 : result.constructor) === null || _a === void 0 ? void 0 : _a.name}, expected MockCore`);
            }
            return result;
        }
        catch (e) {
            console.error("[ERROR] BeforeEach failed:", e);
            throw e;
        }
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        return whenCB(store, pm);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        return thenCB(store, pm);
    },
    afterEach: (store) => store,
    afterAll: (store, pm) => { },
    assertThis: (result) => !!result,
    beforeAll: async (input, testResource, pm) => input,
};
