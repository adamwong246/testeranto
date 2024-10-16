import test from "../../../Web.js";
import React from "react";
import renderer, { act } from "react-test-renderer";
export default (testImplementations, testSpecifications, testInput) => test(testInput, testSpecifications, testImplementations, {
    beforeEach: function (CComponent, props) {
        return new Promise((res, rej) => {
            let component;
            act(() => {
                component = renderer.create(React.createElement(CComponent, props, []));
                res(component);
            });
        });
    },
    andWhen: async function (renderer, whenCB) {
        await act(() => whenCB()(renderer));
        return renderer;
    },
    afterEach: async (store, key, artificer) => {
        console.log("afterall");
        store.unmount();
    },
});
