import React from "react";
import renderer, { act } from "react-test-renderer";
export const testInterface = {
    butThen: async function (s, thenCB) {
        // console.log("butThen", thenCB.toString());
        return thenCB(s);
    },
    beforeEach: function (CComponent, props) {
        let component;
        act(() => {
            // component = renderer.create(
            //   React.createElement(
            //     AppContext.Provider,
            //     { value: contextValue },
            //     React.createElement(AppContext.Consumer, null, (context) =>
            //       React.createElement(CComponent, Object.assign({}, context, {}))
            //     )
            //   )
            // );
            component = renderer.create(React.createElement(CComponent, props, React.createElement(CComponent, props, [])));
        });
        return component;
    },
    andWhen: async function (renderer, whenCB) {
        await act(() => whenCB(renderer));
        return renderer;
    },
};
