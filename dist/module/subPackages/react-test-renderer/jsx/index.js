import React from "react";
import renderer, { act } from "react-test-renderer";
export const testInterface = {
    beforeEach: function (CComponent, props) {
        let component;
        act(() => {
            component = renderer.create(React.createElement(CComponent, props, []));
        });
        return component;
    },
    andWhen: async function (renderer, actioner) {
        await act(() => actioner()(renderer));
        return renderer;
    }
};
