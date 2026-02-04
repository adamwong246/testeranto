import { defaultTestResourceRequirement } from "./types";
// let tpskrt;
// // Use esbuild define to distinguish environments
// declare const ENV: "node" | "web";
// if (ENV === "node") {
//   tpskrt = await import("./Node");
// } else if (ENV === "web") {
//   tpskrt = await import("./Web");
// } else {
//   throw `Unknown ENV ${ENV}`;
// }
let tpskrt;
const tpskrtNode = await import("./Node");
// const tpskrtWeb = await import("./Web");
tpskrt = tpskrtNode;
// Use esbuild define to distinguish environments
// declare const ENV: "node" | "web";
// if (ENV === "node") {
//   tpskrt = tpskrtNode
// } else if (ENV === "web") {
//   tpskrt = tpskrtWeb
// } else {
//   throw `Unknown ENV ${ENV}`;
// }
export default async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement, testResourceConfiguration) => {
    return (await tpskrt.default)(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, testResourceConfiguration);
};
export const BaseAdapter = () => ({
    beforeAll: async (input, testResource) => {
        return input;
    },
    beforeEach: async function (subject, initializer, testResource, initialValues) {
        return subject;
    },
    afterEach: async (store, key) => Promise.resolve(store),
    afterAll: (store) => undefined,
    butThen: async (store, thenCb, testResource) => {
        return thenCb(store);
    },
    andWhen: async (store, whenCB, testResource) => {
        return whenCB(store);
    },
    assertThis: (x) => x,
});
export const DefaultAdapter = (p) => {
    const base = BaseAdapter();
    return Object.assign(Object.assign({}, base), p);
};
