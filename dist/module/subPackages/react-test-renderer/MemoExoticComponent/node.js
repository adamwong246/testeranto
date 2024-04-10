import test from "../../../Node";
import React from "react";
import renderer, { act } from "react-test-renderer";
export default (testImplementations, testSpecifications, testInput) => test(testInput, testSpecifications, testImplementations, {
    beforeEach: function (CComponent, props) {
        let component;
        act(() => {
            component = renderer.create(React.createElement(CComponent, props, []));
        });
        return component;
    },
    andWhen: async function (renderer, whenCB) {
        await act(() => whenCB()(renderer));
        return renderer;
    },
});
