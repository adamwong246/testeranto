"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const web_1 = __importDefault(require("testeranto-react/src/react-dom/component/web"));
const implementation_1 = require("./implementation");
const specification_1 = require("./specification");
const ModalContent_1 = require("../ModalContent");
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
// import { ITestInterface } from "../../../CoreTypes";
// import { IPM } from "../../../lib/types";
const testAdapter = {
    beforeAll: async (input, testResource, pm) => {
        // The subject is the component itself, which we'll use to create instances
        return ModalContent_1.ModalContent;
    },
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        // Create a container and mount the component
        const container = document.createElement('div');
        document.body.appendChild(container);
        const props = initializer();
        const root = client_1.default.createRoot(container);
        const reactElement = react_1.default.createElement(subject, props);
        root.render(reactElement);
        // Wait for the component to render
        await new Promise(resolve => setTimeout(resolve, 0));
        return {
            htmlElement: container,
            reactElement: reactElement,
            domRoot: root
        };
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        return whenCB(store, pm);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        return thenCB(store, pm);
    },
    afterEach: async (store, key, pm) => {
        // Cleanup
        if (store.domRoot) {
            store.domRoot.unmount();
        }
        if (store.htmlElement && store.htmlElement.parentNode) {
            store.htmlElement.parentNode.removeChild(store.htmlElement);
        }
        return store;
    },
    afterAll: async (store, pm) => {
        // No-op for now
    },
    assertThis: (assertion) => {
        // The assertions are handled in the then implementations
        // This can be a no-op or can wrap the assertion if needed
        return assertion;
    }
};
exports.default = (0, web_1.default)(ModalContent_1.ModalContent, specification_1.specification, implementation_1.implementation, testAdapter);
