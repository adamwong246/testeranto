/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockTiposkripto } from "./MockTiposkripto";
export const testAdapter = {
    beforeAll: async (input, testResource, pm) => input,
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        var _a;
        const result = await initializer();
        if (!result) {
            throw new Error("Initializer returned undefined");
        }
        if (!(result instanceof MockTiposkripto)) {
            throw new Error(`Initializer returned ${(_a = result === null || result === void 0 ? void 0 : result.constructor) === null || _a === void 0 ? void 0 : _a.name}, expected MockTiposkripto`);
        }
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
    assertThis: (x) => !!x,
};
