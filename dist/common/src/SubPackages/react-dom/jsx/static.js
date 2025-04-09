"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
const react_1 = require("react");
const react_2 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const TesterantoComponent = ({ done, innerComp, }) => {
    const myContainer = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        done(myContainer.current);
    }, []);
    return react_2.default.createElement("div", { ref: myContainer }, innerComp());
};
exports.testInterface = {
    beforeAll: async (reactElement, itr) => {
        return await new Promise((resolve, rej) => {
            const htmlElement = document.getElementById("root");
            if (htmlElement) {
                const domRoot = client_1.default.createRoot(htmlElement);
                domRoot.render((0, react_1.createElement)(TesterantoComponent, {
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
    beforeEach: async (subject) => {
        return subject;
    },
    andWhen: async function (s, whenCB, tr, utils) {
        return whenCB(s, utils);
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
};
