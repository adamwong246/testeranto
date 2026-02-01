"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAdapter = exports.BaseAdapter = void 0;
const types_1 = require("./types");
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
const tpskrtNode = await Promise.resolve().then(() => __importStar(require("./Node")));
const tpskrtWeb = await Promise.resolve().then(() => __importStar(require("./Web")));
if (ENV === "node") {
    tpskrt = tpskrtNode;
}
else if (ENV === "web") {
    tpskrt = tpskrtWeb;
}
else {
    throw `Unknown ENV ${ENV}`;
}
exports.default = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = types_1.defaultTestResourceRequirement, testResourceConfiguration) => {
    return (await tpskrt.default)(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, testResourceConfiguration);
};
const BaseAdapter = () => ({
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
exports.BaseAdapter = BaseAdapter;
const DefaultAdapter = (p) => {
    const base = (0, exports.BaseAdapter)();
    return Object.assign(Object.assign({}, base), p);
};
exports.DefaultAdapter = DefaultAdapter;
