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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_test_renderer_1 = __importStar(require("react-test-renderer"));
const Web_js_1 = __importDefault(require("../../../Web.js"));
exports.default = (testImplementations, testSpecifications, testInput) => (0, Web_js_1.default)(testInput, testSpecifications, testImplementations, {
    beforeEach: function (CComponent, props) {
        return new Promise((res, rej) => {
            let component;
            (0, react_test_renderer_1.act)(() => {
                component = react_test_renderer_1.default.create(react_1.default.createElement(CComponent, props, []));
                res(component);
            });
        });
    },
    andWhen: async function (renderer, whenCB) {
        await (0, react_test_renderer_1.act)(() => whenCB()(renderer));
        return renderer;
    },
    afterEach: async (store, key, artificer) => {
        console.log("afterall");
        store.unmount();
    },
});
