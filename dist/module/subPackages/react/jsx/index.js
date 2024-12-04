import React from "react";
export const testInterface = {
    // beforeAll: async (proto, testResource, artificer, pm): Promise<IStore> => {
    //   return React.createElement(proto);
    //   // return new Promise((resolve, rej) => {
    //   //   resolve(x());
    //   // });
    // },
    beforeEach: async (subject, initializer, artificer) => {
        return new Promise((resolve, rej) => {
            const x = React.createElement(subject);
            console.log("react-element", x);
            resolve(x);
        });
    },
    andWhen: function (s, whenCB) {
        return whenCB(s);
    },
};
