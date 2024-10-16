import React from "react";
import Testeranto from "../../../Web.js";
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, {
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
