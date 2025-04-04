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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("react");
const react_dom_1 = __importDefault(require("react-dom"));
const Web_js_1 = __importDefault(require("../../../Web.js"));
const TesterantoComponent = ({ done, innerComp, }) => {
    const myContainer = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        console.log("useEffect called!", myContainer.current);
        done(myContainer.current);
    }, []);
    return react_1.default.createElement("div", { ref: myContainer }, innerComp());
};
exports.default = (testImplementations, testSpecifications, testInput) => {
    const t = (0, Web_js_1.default)(testInput, testSpecifications, testImplementations, {
        beforeAll: async (reactElement, itr) => {
            return await new Promise((resolve, rej) => {
                const htmlElement = document.getElementById("root");
                if (htmlElement) {
                    const domRoot = react_dom_1.default.createRoot(htmlElement);
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
                resolve(subject);
                // const tc = TesterantoComponent({
                //   innerComp: () =>
                //     testInput({
                //       port: 3003,
                //       address: "some-address",
                //       secretKey: "someSecretKey",
                //       abi: "foo",
                //     }),
                //   done: (reactElement: any) => {
                //     console.log("mark9");
                //     resolve(reactElement);
                //     // process.nextTick(() => {
                //     //   resolve(reactElement);
                //     // });
                //   },
                // });
                // console.log("mark9", tc);
                // createPortal(tc, subject.domRoot);
            });
        },
        andWhen: function (s, whenCB, tr, utils) {
            return whenCB(s, utils);
            // return new Promise(async (resolve, rej) => {
            //   // resolve(await whenCB(s, utils));
            //   // process.nextTick(() => {
            //   //   resolve(whenCB()(s));
            //   // });
            // });
        },
        butThen: async function (s, thenCB, tr, utils) {
            return new Promise((resolve, rej) => {
                resolve(thenCB(s, utils));
            });
        },
        afterEach: async function (store, ndx, artificer) {
            return new Promise((resolve, rej) => {
                resolve({});
            });
        },
        afterAll: (store, artificer) => {
            return new Promise((resolve, rej) => {
                resolve({});
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
