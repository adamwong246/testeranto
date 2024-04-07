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
const Web_1 = __importDefault(require("../../../Web"));
const react_1 = __importStar(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
exports.default = (testImplementations, testSpecifications, testInput) => {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        const rootElement = document.getElementById("root");
        if (rootElement) {
            const TesterantoComponent = function ({ done, innerComp }) {
                const myContainer = (0, react_1.useRef)(null);
                (0, react_1.useEffect)(() => {
                    console.log("useEffect called");
                    done(myContainer.current);
                }, []);
                return react_1.default.createElement('div', { ref: myContainer }, innerComp());
            };
            (0, Web_1.default)(testInput, testSpecifications, testImplementations, {
                beforeAll: async (input, artificer) => {
                    console.log("beforeAll", input);
                    return await new Promise((resolve, rej) => {
                        resolve(rootElement);
                    });
                },
                beforeEach: async (subject, ndx, testRsource, artificer) => {
                    return new Promise((resolve, rej) => {
                        console.log("beforeEach", subject);
                        client_1.default.createRoot(rootElement).
                            render(
                        // ignore this type error
                        react_1.default.createElement(TesterantoComponent, {
                            done: (reactElement) => resolve(reactElement),
                            innerComp: testInput
                        }, []));
                    });
                },
                andWhen: function (s, actioner) {
                    return actioner()(s);
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
        }
    });
};
