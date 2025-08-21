/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const BaseAdapter = () => ({
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
export const DefaultAdapter = (p) => {
    const base = BaseAdapter();
    return Object.assign(Object.assign({}, base), p);
};
export const defaultTestResourceRequirement = {
    ports: 0,
};
