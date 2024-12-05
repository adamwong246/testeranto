import React, { useEffect, useRef } from "react";
import { createElement } from "react";
import ReactDom from "react-dom/client";
import { createPortal } from "react-dom";
import Testeranto from "../../../Web.js";
export default (testImplementations, testSpecifications, testInput) => {
    console.log("testInput", testInput);
    const TesterantoComponent = function ({ done, innerComp, }) {
        const myContainer = useRef(null);
        useEffect(() => {
            console.log("useEffect called!", myContainer.current);
            done(myContainer.current);
        }, []);
        // debugger;
        return React.createElement("div", { ref: myContainer }, innerComp());
    };
    const t = Testeranto(testInput, testSpecifications, testImplementations, {
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
        beforeEach: async (subject, initializer, artificer, testResource, pm) => {
            return new Promise((resolve, rej) => {
                createPortal(TesterantoComponent({
                    innerComp: () => testInput({
                        port: 3003,
                        address: "some-address",
                        secretKey: "someSecretKey",
                        abi: "foo",
                    }),
                    done: (reactElement) => {
                        process.nextTick(() => {
                            resolve(reactElement);
                        });
                    },
                }), subject.domRoot);
            });
        },
        andWhen: function (s, whenCB) {
            return new Promise((resolve, rej) => {
                process.nextTick(() => {
                    resolve(whenCB()(s));
                });
            });
        },
        butThen: async function (s) {
            return new Promise((resolve, rej) => {
                process.nextTick(() => {
                    resolve(s);
                });
            });
        },
        afterEach: async function (store, ndx, artificer) {
            return new Promise((resolve, rej) => {
                process.nextTick(() => {
                    resolve({});
                });
            });
        },
        afterAll: (store, artificer) => {
            return new Promise((resolve, rej) => {
                process.nextTick(() => {
                    resolve({});
                });
            });
        },
    });
    document.addEventListener("DOMContentLoaded", function () {
        const rootElement = document.getElementById("root");
        if (rootElement) {
        }
    });
    return t;
};
