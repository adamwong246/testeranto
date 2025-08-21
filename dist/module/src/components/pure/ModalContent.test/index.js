import Testeranto from "testeranto-react/src/react-dom/component/web";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { ModalContent } from "../ModalContent";
import React from "react";
import ReactDOM from "react-dom/client";
const testAdapter = {
    beforeAll: async (input, testResource, pm) => {
        // The subject is the component itself, which we'll use to create instances
        return ModalContent;
    },
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        // Create a container and mount the component
        const container = document.createElement('div');
        document.body.appendChild(container);
        const props = initializer();
        const root = ReactDOM.createRoot(container);
        const reactElement = React.createElement(subject, props);
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
export default Testeranto(ModalContent, specification, implementation, testAdapter);
