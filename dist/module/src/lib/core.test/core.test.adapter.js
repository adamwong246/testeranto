export const testAdapter = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        return initializer();
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
