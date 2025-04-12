export const BaseTestInterface = {
    beforeAll: async (s) => s,
    beforeEach: async function (subject, initialValues, x, testResource, pm) {
        return subject;
    },
    afterEach: async (s) => s,
    afterAll: (store) => undefined,
    butThen: async (store, thenCb) => {
        return thenCb(store);
    },
    andWhen: async (a) => a,
    assertThis: (x) => null,
};
export const DefaultTestInterface = (p) => {
    return Object.assign(Object.assign({}, BaseTestInterface), p);
};
export const defaultTestResourceRequirement = {
    ports: 0,
};
