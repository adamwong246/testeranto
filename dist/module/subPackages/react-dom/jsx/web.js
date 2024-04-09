import Testeranto from "../../../Web";
import React, { useEffect, useRef, } from "react";
import { createPortal } from 'react-dom';
export default (testImplementations, testSpecifications, testInput) => {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        const rootElement = document.getElementById("root");
        if (rootElement) {
            const TesterantoComponent = function ({ done, innerComp }) {
                const myContainer = useRef(null);
                useEffect(() => {
                    console.log("useEffect called", myContainer.current);
                    // if (!myContainer.current) {
                    //   // do componentDidMount logic
                    //   myContainer.current = true;
                    // } else {
                    //   // do componentDidUpdate logic
                    // }
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
                        createPortal(TesterantoComponent({
                            innerComp: testInput,
                            done: (reactElement) => {
                                process.nextTick(() => {
                                    resolve(reactElement); // do something
                                });
                            }
                        }), rootElement);
                    });
                },
                andWhen: function (s, actioner) {
                    return new Promise((resolve, rej) => {
                        process.nextTick(() => { resolve(actioner()(s)); });
                    });
                },
                butThen: async function (s) {
                    return new Promise((resolve, rej) => {
                        process.nextTick(() => { resolve(s); });
                    });
                },
                afterEach: async function (store, ndx, artificer) {
                    return new Promise((resolve, rej) => {
                        process.nextTick(() => { resolve({}); });
                    });
                },
                afterAll: (store, artificer) => {
                    return new Promise((resolve, rej) => {
                        process.nextTick(() => { resolve({}); });
                    });
                },
            });
        }
    });
};
