import { createElement, useEffect, useRef } from "react";
import React from "react";
import ReactDom from "react-dom/client";
const TesterantoComponent = ({ done, innerComp, }) => {
    const myContainer = useRef(null);
    useEffect(() => {
        done(myContainer.current);
    }, []);
    return React.createElement("div", { ref: myContainer }, innerComp());
};
export const testInterface = {
    beforeAll: async (reactElement, itr) => {
        return await new Promise((resolve, rej) => {
            const htmlElement = document.getElementById("root");
            if (htmlElement) {
                const domRoot = ReactDom.createRoot(htmlElement);
                domRoot.render(createElement(TesterantoComponent, {
                    // ...initialProps,
                    innerComp: reactElement,
                    done: (reactElement) => {
                        resolve({
                            htmlElement,
                            reactElement,
                            domRoot,
                        });
                    },
                }, []));
                // resolve({ htmlElement });
            }
        });
    },
    beforeEach: async (subject) => {
        return subject;
    },
    andWhen: async function (s, whenCB, tr, utils) {
        return whenCB(s, utils);
    },
    butThen: async function (s, thenCB, tr, utils) {
        return new Promise((resolve, rej) => {
            resolve(thenCB(s, utils));
        });
    },
    afterEach: async function (store, ndx, artificer) {
        return new Promise((resolve, rej) => {
            resolve({});
        });
    },
    afterAll: (store, artificer) => {
        return new Promise((resolve, rej) => {
            resolve({});
        });
    },
};
