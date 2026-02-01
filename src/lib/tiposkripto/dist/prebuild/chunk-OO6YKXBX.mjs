// src/types.ts
var defaultTestResourceRequirement = {
  ports: 0
};

// src/index.ts
var tpskrt;
var tpskrtNode = await import("./Node-QKPFQUAO.mjs");
var tpskrtWeb = await import("./Web-54TRFOX2.mjs");
if (ENV === "node") {
  tpskrt = tpskrtNode;
} else if (ENV === "web") {
  tpskrt = tpskrtWeb;
} else {
  throw `Unknown ENV ${ENV}`;
}
var index_default = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement, testResourceConfiguration) => {
  return (await tpskrt.default)(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter,
    testResourceConfiguration
  );
};
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

export {
  defaultTestResourceRequirement,
  index_default,
  BaseAdapter,
  DefaultAdapter
};
