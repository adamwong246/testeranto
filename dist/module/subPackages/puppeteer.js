import React from "react";
import Testeranto from "../Node";
export default (testInput, testSpecifications, testImplementations) => {
    return Testeranto(testInput, testSpecifications, testImplementations, {
        beforeAll(x) {
            process.parentPort.postMessage(`/dist/web/src/ClassicalComponent/test.html`);
            return x;
        },
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(React.createElement(testInput, {}, []));
            });
        },
        andWhen: function (s, whenCB) {
            return whenCB()(s);
        },
    });
};
