/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const adapter = {
    beforeAll: async (input, testResource, pm) => {
        return input;
    },
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        const result = await initializer();
        return result;
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        // The whenCB should be a function that returns a function which takes the store
        // For press("2"), whenCB is (calculator) => { calculator.press("2"); return calculator; }
        const transform = whenCB;
        const result = transform(store);
        return result;
    },
    butThen: async (store, thenCB, testResource, pm) => {
        thenCB(store);
        const display = store.getDisplay();
        return display;
    },
    afterEach: async (store, key, pm) => {
        // Clean up if needed
        return store;
    },
    afterAll: async (store, pm) => {
        // Clean up if needed
        return store;
    },
    assertThis: (actual) => {
        // The actual value comes from butThen which returns the display
        // We don't need to do anything here as assertions are done in thenCB
        return actual;
    },
};
