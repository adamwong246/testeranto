"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = exports.renderToStaticNodeStream = exports.renderToStaticMarkup = void 0;
const react_1 = require("react");
const server_1 = require("react-dom/server");
Object.defineProperty(exports, "renderToStaticMarkup", { enumerable: true, get: function () { return server_1.renderToStaticMarkup; } });
Object.defineProperty(exports, "renderToStaticNodeStream", { enumerable: true, get: function () { return server_1.renderToStaticNodeStream; } });
const stream_1 = __importDefault(require("stream"));
exports.Stream = stream_1.default;
const Node_js_1 = __importDefault(require("../../../Node.js"));
exports.default = (testImplementations, testSpecifications, testInput) => {
    return (0, Node_js_1.default)(testInput, testSpecifications, testImplementations, {
        beforeAll: async (prototype, artificer) => {
            return await new Promise((resolve, rej) => {
                resolve(null);
            });
        },
        beforeEach: async (reactComponent, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                resolve((0, react_1.createElement)(testInput));
            });
        },
        andWhen: async function (s, whenCB) {
            return s;
        },
        butThen: async function (s) {
            return s;
        },
        afterEach: async function (store, ndx, artificer) {
            return {};
        },
        afterAll: (store, artificer) => {
            return;
        },
    });
};
