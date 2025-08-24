"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
exports.implementation = {
    suites: {
        Default: "Abstract Base Test Suite",
    },
    givens: {
        Default: () => () => ({
            testStore: { value: "initial" },
            testSelection: { selected: true },
        }),
        WithError: () => () => ({
            testStore: { value: "error" },
            testSelection: { selected: false },
        }),
    },
    whens: {
        modifyStore: (newValue) => (store) => (Object.assign(Object.assign({}, store), { testStore: { value: newValue } })),
        throwError: () => (store) => {
            throw new Error("Test error");
        },
    },
    thens: {
        verifyStore: (expected) => (store) => {
            if (store.testStore.value !== expected) {
                throw new Error(`Expected ${expected}, got ${store.testStore.value}`);
            }
            return store;
        },
        verifyError: (expected) => (store) => {
            if (!store.error || !store.error.message.includes(expected)) {
                throw new Error(`Expected error "${expected}" not found`);
            }
            return store;
        },
    },
};
