import React from "react";
export const testInterface = {
    // beforeAll: async (proto, testResource, artificer, pm): Promise<IStore> => {
    //   return React.createElement(proto);
    //   // return new Promise((resolve, rej) => {
    //   //   resolve(x());
    //   // });
    // },
    // beforeEach: async (subject, initializer, artificer): Promise<IStore> => {
    //   return new Promise((resolve, rej) => {
    //     resolve(React.createElement(subject));
    //   });
    // },
    andWhen: async (s, whenCB) => {
        await whenCB(s());
        return new Promise((resolve, rej) => {
            resolve(React.createElement(s));
        });
        // return whenCB(s);
    },
    butThen: async (subject, thenCB) => {
        await thenCB(subject());
        return new Promise((resolve, rej) => {
            resolve(React.createElement(subject));
        });
    },
};
