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
    andWhen: async (store, whenCB, testResource, pm) => {
        await whenCB(store, testResource, pm);
        // (async () => {
        //   await whenCB(store, testResource, pm);
        // })().catch((e) => {
        //   console.log("fopp", e); // caught
        // });
        // console.log("mark999", whenCB.toString());
        // return i;
        // try {
        //   return await whenCB(store, testResource, pm);
        // } catch (e) {
        //   console.log("mark2", e);
        // }
        // whenCB(store, testResource, pm).catch((e) => {
        //   console.log("mark2", e);
        // });
    },
    assertThis: (x) => x,
};
export const DefaultTestInterface = (p) => {
    return Object.assign(Object.assign({}, BaseTestInterface), p);
};
export const defaultTestResourceRequirement = {
    ports: 0,
};
