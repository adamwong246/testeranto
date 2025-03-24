import React from "react";
import renderer, { act } from "react-test-renderer";
export const testInterface = {
    beforeEach: function (CComponent, propsAndChildren) {
        function Link(props) {
            const p = props.props;
            const c = props.children;
            return React.createElement(CComponent, p, c);
        }
        return new Promise((res, rej) => {
            act(async () => {
                const p = propsAndChildren;
                const y = new CComponent(p.props);
                const testRenderer = await renderer.create(Link(propsAndChildren));
                res(testRenderer);
            });
        });
    },
    andWhen: async function (renderer, whenCB) {
        await act(() => whenCB(renderer));
        return renderer;
    },
    // andWhen: function (s: Store, whenCB): Promise<Selection> {
    //   return whenCB()(s);
    // },
    butThen: async function (s, thenCB, tr) {
        return thenCB(s);
    },
    afterEach: async function (store, ndx, artificer) {
        return {};
    },
    afterAll: (store, artificer) => {
        return;
    },
};
