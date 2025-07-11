export const BaseTestInterface = () => ({
    beforeAll: async (s) => s,
    beforeEach: async function (subject, initialValues, x, testResource, pm) {
        return subject;
    },
    afterEach: async (s) => s,
    afterAll: (store) => undefined,
    butThen: async (store, thenCb) => {
        return thenCb(store);
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        try {
            await whenCB(store, testResource, pm);
        }
        catch (error) {
            console.error("Error in andWhen:", error);
            throw error; // Re-throw to maintain test failure
        }
    },
    assertThis: (x) => x,
});
export const DefaultTestInterface = (p) => {
    return Object.assign(Object.assign({}, BaseTestInterface), p);
};
export const defaultTestResourceRequirement = {
    ports: 0,
};
