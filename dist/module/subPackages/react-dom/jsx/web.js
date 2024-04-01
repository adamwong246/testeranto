import React, { useEffect, useRef, } from "react";
import ReactDom from "react-dom/client";
import Testeranto from "../../../../src/Web";
export default (testImplementations, testSpecifications, testInput) => {
    const TesterantoComponent = function (props) {
        const myContainer = useRef(null);
        useEffect(() => {
            console.log("This only happens ONCE. It happens AFTER the initial render.");
            // eslint-disable-next-line react/prop-types
            props.done(myContainer.current);
        }, []);
        return React.createElement('div', { ref: myContainer }, testInput()); //testInput();
    };
    return Testeranto(testInput, testSpecifications, testImplementations, {
        beforeAll: async (prototype, artificer) => {
            artificer("./before.txt", "hello artificer");
            return await new Promise((resolve, rej) => {
                document.addEventListener("DOMContentLoaded", function () {
                    const elem = document.getElementById("root");
                    if (elem) {
                        resolve({ root: elem });
                    }
                });
            });
        },
        beforeEach: async ({ root }, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                ReactDom.createRoot(root).
                    render(React.createElement(TesterantoComponent, {
                    done: (react) => resolve({ root, react })
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
            // store.page.browser().close();
            return;
        },
    });
};
