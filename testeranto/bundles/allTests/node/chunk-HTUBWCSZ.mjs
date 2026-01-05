// src/tiposkripto/index.ts
var BaseAdapter = () => ({
  beforeAll: async (input, testResource) => {
    return input;
  },
  beforeEach: async function(subject, initializer, testResource, initialValues) {
    return subject;
  },
  afterEach: async (store, key) => Promise.resolve(store),
  afterAll: (store) => void 0,
  butThen: async (store, thenCb, testResource) => {
    return thenCb(store);
  },
  andWhen: async (store, whenCB, testResource) => {
    return whenCB(store);
  },
  assertThis: (x) => x
});
var DefaultAdapter = (p) => {
  const base = BaseAdapter();
  return {
    ...base,
    ...p
  };
};
var defaultTestResourceRequirement = {
  ports: 0
};

export {
  DefaultAdapter,
  defaultTestResourceRequirement
};
