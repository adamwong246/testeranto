import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/lib/index.ts
var BaseAdapter = () => ({
  beforeAll: async (input, testResource, pm) => {
    return input;
  },
  beforeEach: async function(subject, initializer, testResource, initialValues, pm) {
    return subject;
  },
  afterEach: async (store, key, pm) => Promise.resolve(store),
  afterAll: (store, pm) => void 0,
  butThen: async (store, thenCb, testResource, pm) => {
    return thenCb(store, pm);
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    return whenCB(store, pm);
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
