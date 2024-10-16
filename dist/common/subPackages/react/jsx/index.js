"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
exports.testInterface = {
    beforeEach: async (x, ndx, testRsource, artificer) => {
        return new Promise((resolve, rej) => {
            resolve(x());
        });
    },
    andWhen: function (s, whenCB) {
        return whenCB(s);
    },
};
