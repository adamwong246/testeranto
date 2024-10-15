import React, { useEffect, useRef, } from "react";
import { createPortal } from 'react-dom';
import Testeranto from "../../../Web";
export default (testImplementations, testSpecifications, testInput) => {
    document.addEventListener("DOMContentLoaded", function () {
        const rootElement = document.getElementById("root");
        if (rootElement) {
            const TesterantoComponent = function ({ done, innerComp }) {
                const myContainer = useRef(null);
                useEffect(() => {
                    console.log("useEffect called", myContainer.current);
                    done(myContainer.current);
                }, []);
                return React.createElement('div', { ref: myContainer }, innerComp());
            };
            Testeranto(testInput, testSpecifications, testImplementations, {
                beforeAll: async (input, artificer) => {
                    return await new Promise((resolve, rej) => {
                        resolve(rootElement);
                    });
                },
                beforeEach: async (subject, ndx, testRsource, artificer) => {
                    return new Promise((resolve, rej) => {
                        createPortal(TesterantoComponent({
                            innerComp: testInput,
                            done: (reactElement) => {
                                process.nextTick(() => {
                                    resolve(reactElement);
                                });
                            }
                        }), rootElement);
                    });
                },
                andWhen: function (s, whenCB) {
                    return new Promise((resolve, rej) => {
                        process.nextTick(() => { resolve(whenCB()(s)); });
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
