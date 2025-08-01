"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapter = void 0;
exports.adapter = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        return initializer();
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        return whenCB(store, pm);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        return thenCB(store, pm);
    },
    afterEach: async (store, key, pm) => {
        if (store === null || store === void 0 ? void 0 : store.container) {
            store.container.remove();
        }
        return store;
    },
};
