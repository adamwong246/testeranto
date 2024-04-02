import test from "../../../Web";
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
    andWhen: async function (renderer, actioner) {
        await act(() => actioner()(renderer));
        return renderer;
    },
    afterEach: async (store, key, artificer) => {
        console.log("afterall");
        store.unmount();
    },
});
