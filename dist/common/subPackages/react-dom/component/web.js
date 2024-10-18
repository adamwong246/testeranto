"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const client_1 = __importDefault(require("react-dom/client"));
const Web_js_1 = __importDefault(require("../../../Web.js"));
exports.default = (testInput, testSpecifications, testImplementations) => {
    document.addEventListener("DOMContentLoaded", function () {
        const elem = document.getElementById("root");
        if (elem) {
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
            return (0, Web_js_1.default)(testInput, testSpecifications, testImplementations, {
                beforeAll: async (initialProps, artificer) => {
                    console.log("mark5", initialProps);
                    return await new Promise((resolve, rej) => {
                        const elem = document.getElementById("root");
                        if (elem) {
                            resolve({ htmlElement: elem });
                        }
                    });
                },
                beforeEach: async ({ htmlElement }, initializer, testResource, artificer, initialValues) => {
                    return new Promise((resolve, rej) => {
                        // console.log("beforeEach" + JSON.stringify(initializer) + JSON.stringify(initialValues));
                        // Ignore these type errors
                        client_1.default.createRoot(htmlElement).render((0, react_1.createElement)(TesterantoComponent, Object.assign(Object.assign({}, initializer), { done: (reactElement) => {
                                resolve({
                                    htmlElement,
                                    reactElement,
                                });
                            } }), []));
                    });
                },
                andWhen: function (s, whenCB) {
                    return whenCB(s);
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
