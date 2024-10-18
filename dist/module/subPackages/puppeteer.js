import React from "react";
import Testeranto from "../Node.js";
export default (testInput, testSpecifications, testImplementations, testInterface) => {
    return Testeranto(testInput, testSpecifications, testImplementations, Object.assign({ beforeAll(x) {
            process.parentPort.postMessage(`/docs/web/src/ClassicalComponent/test.html`);
            return x;
        }, beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(React.createElement(testInput, {}, []));
            });
        }, andWhen: function (s, whenCB) {
            return whenCB()(s);
        } }, testInterface));
};
