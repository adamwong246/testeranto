"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const client_1 = __importDefault(require("react-dom/client"));
const Web_js_1 = __importDefault(require("../../../Web.js"));
exports.default = (testInput, testSpecifications, testImplementations, testInterface) => {
    class TesterantoComponent extends testInput {
        constructor(props) {
            super(props);
            this.done = props.done;
        }
        componentDidMount() {
            super.componentDidMount && super.componentDidMount();
            return this.done(this);
        }
    }
    const t = (0, Web_js_1.default)(testInput, testSpecifications, testImplementations, {
        beforeAll: async (initialProps, artificer) => {
            return await new Promise((resolve, rej) => {
                const htmlElement = document.getElementById("root");
                if (htmlElement) {
                    const domRoot = client_1.default.createRoot(htmlElement);
                    // Ignore these type errors
                    domRoot.render((0, react_1.createElement)(TesterantoComponent, Object.assign(Object.assign({}, initialProps), { done: (reactElement) => {
                            resolve({
                                htmlElement,
                                reactElement,
                                domRoot,
                            });
                        } }), []));
                    // resolve({ htmlElement });
                }
            });
        },
        // beforeEach: async (
        //   s,
        //   initializer,
        //   testResource,
        //   artificer,
        //   initialValues
        // ): Promise<IStore> => {
        //   return new Promise((resolve, rej) => {
        //     console.log("beforeEach" + TesterantoComponent);
        //     // const domRoot = ReactDom.createRoot(htmlElement);
        //     // // Ignore these type errors
        //     // domRoot.render(
        //     //   createElement(
        //     //     TesterantoComponent,
        //     //     {
        //     //       ...initializer,
        //     //       done: (reactElement) => {
        //     //         resolve({
        //     //           htmlElement,
        //     //           reactElement,
        //     //           domRoot,
        //     //         });
        //     //       },
        //     //     },
        //     //     []
        //     //   )
        //     // );
        //   });
        // },
        andWhen: function (s, whenCB) {
            return whenCB(s);
        },
        butThen: async function (s, thenCB) {
            return thenCB(s);
        },
        afterEach: (testInterface === null || testInterface === void 0 ? void 0 : testInterface.afterEach) ||
            async function (store, ndx, artificer, utils) {
                return store;
            },
        afterAll: async (store, artificer, utils) => {
            // setTimeout(() => {
            //   console.log("This will run after 1 second");
            // }, 1000); // 1000 milliseconds = 1 second
            // store.htmlElement.remove();
            // store.htmlElement = document.createElement("root");
            return store;
        },
    });
    document.addEventListener("DOMContentLoaded", function () {
        const elem = document.getElementById("root");
        if (elem) {
            return t;
        }
    });
    return t;
};
