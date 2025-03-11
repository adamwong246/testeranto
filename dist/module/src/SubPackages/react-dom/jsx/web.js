import React, { useEffect, useRef } from "react";
import { createElement } from "react";
import ReactDom from "react-dom";
import Testeranto from "../../../Web.js";
const TesterantoComponent = ({ done, innerComp, }) => {
    const myContainer = useRef(null);
    useEffect(() => {
        console.log("useEffect called!", myContainer.current);
        done(myContainer.current);
    }, []);
    return React.createElement("div", { ref: myContainer }, innerComp());
};
export default (testImplementations, testSpecifications, testInput) => {
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
                resolve(subject);
                // const tc = TesterantoComponent({
                //   innerComp: () =>
                //     testInput({
                //       port: 3003,
                //       address: "some-address",
                //       secretKey: "someSecretKey",
                //       abi: "foo",
                //     }),
                //   done: (reactElement: any) => {
                //     console.log("mark9");
                //     resolve(reactElement);
                //     // process.nextTick(() => {
                //     //   resolve(reactElement);
                //     // });
                //   },
                // });
                // console.log("mark9", tc);
                // createPortal(tc, subject.domRoot);
            });
        },
        andWhen: function (s, whenCB, tr, utils) {
            return whenCB(s, utils);
            // return new Promise(async (resolve, rej) => {
            //   // resolve(await whenCB(s, utils));
            //   // process.nextTick(() => {
            //   //   resolve(whenCB()(s));
            //   // });
            // });
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
    });
    document.addEventListener("DOMContentLoaded", function () {
        const rootElement = document.getElementById("root");
        if (rootElement) {
        }
    });
    return t;
};
