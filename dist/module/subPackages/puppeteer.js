import React from "react";
// const { BrowserWindow, app } = require("electron");
import Testeranto from "../Node";
export default (testInput, testSpecifications, testImplementations, testInterface) => {
    return Testeranto(testInput, testSpecifications, testImplementations, Object.assign({ beforeAll(x) {
            process.parentPort.postMessage(`/dist/web/src/ClassicalComponent/test.html`);
            return x;
        }, beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(React.createElement(testInput, {}, []));
            });
        }, andWhen: function (s, whenCB) {
            return whenCB()(s);
        } }, testInterface));
};
