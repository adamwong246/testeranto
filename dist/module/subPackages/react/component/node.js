import React from "react";
import Testeranto from "../../../Node";
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, {
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(React.createElement(testInput, {}, []));
            });
        },
        andWhen: function (s, actioner) {
            return actioner()(s);
        },
    });
};
