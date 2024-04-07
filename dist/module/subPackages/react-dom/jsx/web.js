import Testeranto from "../../../Web";
import React, { useEffect, useRef, } from "react";
import ReactDom from "react-dom/client";
export default (testImplementations, testSpecifications, testInput) => {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        const rootElement = document.getElementById("root");
        if (rootElement) {
            const TesterantoComponent = function ({ done, innerComp }) {
                const myContainer = useRef(null);
                useEffect(() => {
                    console.log("useEffect called");
                    done(myContainer.current);
                }, []);
                return React.createElement('div', { ref: myContainer }, innerComp());
            };
            Testeranto(testInput, testSpecifications, testImplementations, {
                beforeAll: async (input, artificer) => {
                    console.log("beforeAll", input);
                    return await new Promise((resolve, rej) => {
                        resolve(rootElement);
                    });
                },
                beforeEach: async (subject, ndx, testRsource, artificer) => {
                    return new Promise((resolve, rej) => {
                        console.log("beforeEach", subject);
                        ReactDom.createRoot(rootElement).
                            render(
                        // ignore this type error
                        React.createElement(TesterantoComponent, {
                            done: (reactElement) => resolve(reactElement),
                            innerComp: testInput
                        }, []));
                    });
                },
                andWhen: function (s, actioner) {
                    return actioner()(s);
                },
                butThen: async function (s) {
                    return s;
                },
                afterEach: async function (store, ndx, artificer) {
                    return {};
                },
                afterAll: (store, artificer) => {
                    return;
                },
            });
        }
    });
};
