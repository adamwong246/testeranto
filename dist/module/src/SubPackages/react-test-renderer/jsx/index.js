import React from "react";
import renderer, { act } from "react-test-renderer";
const Context = React.createContext({});
const AppContext = React.createContext({});
const contextValue = {
    ingredients: ["flour", "sugar", "eggs"],
    temperature: "200",
};
export const testInterface = {
    butThen: async function (s, thenCB, tr) {
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
