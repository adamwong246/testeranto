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
const react_1 = __importStar(require("react"));
const react_2 = require("react");
const client_1 = __importDefault(require("react-dom/client"));
const react_dom_1 = require("react-dom");
const Web_js_1 = __importDefault(require("../../../Web.js"));
exports.default = (testImplementations, testSpecifications, testInput) => {
    console.log("testInput", testInput);
    const TesterantoComponent = function ({ done, innerComp, }) {
        const myContainer = (0, react_1.useRef)(null);
        (0, react_1.useEffect)(() => {
            console.log("useEffect called!", myContainer.current);
            done(myContainer.current);
        }, []);
        // debugger;
        return react_1.default.createElement("div", { ref: myContainer }, innerComp());
    };
    const t = (0, Web_js_1.default)(testInput, testSpecifications, testImplementations, {
        beforeAll: async (reactElement, itr) => {
            return await new Promise((resolve, rej) => {
                const htmlElement = document.getElementById("root");
                if (htmlElement) {
                    const domRoot = client_1.default.createRoot(htmlElement);
                    domRoot.render((0, react_2.createElement)(TesterantoComponent, {
                        // ...initialProps,
                        innerComp: reactElement,
                        done: (reactElement) => {
                            resolve({
                                htmlElement,
                                reactElement,
                                domRoot,
                            });
                        },
                    }, []));
                    // resolve({ htmlElement });
                }
            });
        },
        beforeEach: async (subject, initializer, artificer, testResource, pm) => {
            return new Promise((resolve, rej) => {
                (0, react_dom_1.createPortal)(TesterantoComponent({
                    innerComp: () => testInput({
                        port: 3003,
                        address: "some-address",
                        secretKey: "someSecretKey",
                        abi: "foo",
                    }),
                    done: (reactElement) => {
                        process.nextTick(() => {
                            resolve(reactElement);
                        });
                    },
                }), subject.domRoot);
            });
        },
        andWhen: function (s, whenCB) {
            return new Promise((resolve, rej) => {
                process.nextTick(() => {
                    resolve(whenCB()(s));
                });
            });
        },
        butThen: async function (s) {
            return new Promise((resolve, rej) => {
                process.nextTick(() => {
                    resolve(s);
                });
            });
        },
        afterEach: async function (store, ndx, artificer) {
            return new Promise((resolve, rej) => {
                process.nextTick(() => {
                    resolve({});
                });
            });
        },
        afterAll: (store, artificer) => {
            return new Promise((resolve, rej) => {
                process.nextTick(() => {
                    resolve({});
                });
            });
        },
    });
    document.addEventListener("DOMContentLoaded", function () {
        const rootElement = document.getElementById("root");
        if (rootElement) {
        }
    });
    return t;
};
