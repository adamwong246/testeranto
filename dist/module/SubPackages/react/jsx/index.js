import React from "react";
export const testInterface = {
    andWhen: async (s, whenCB) => {
        await whenCB(s());
        return new Promise((resolve, rej) => {
            resolve(React.createElement(s));
        });
    },
    butThen: async (subject, thenCB) => {
        await thenCB(subject());
        return new Promise((resolve, rej) => {
            resolve(React.createElement(subject));
        });
    },
};
