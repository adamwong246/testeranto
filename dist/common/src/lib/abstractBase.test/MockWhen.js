"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockWhen = void 0;
const BaseWhen_1 = require("../BaseWhen");
class MockWhen extends BaseWhen_1.BaseWhen {
    constructor(name, whenCB) {
        super(name, whenCB);
    }
    async andWhen(store, whenCB, testResource, pm) {
        // The whenCB returns a function that takes the store
        const result = whenCB(store);
        if (typeof result === 'function') {
            return result(store);
        }
        return result;
    }
}
exports.MockWhen = MockWhen;
