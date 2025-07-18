"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockWhen = void 0;
const abstractBase_1 = require("../abstractBase");
class MockWhen extends abstractBase_1.BaseWhen {
    constructor(name, whenCB) {
        super(name, whenCB);
    }
    async andWhen(store, whenCB, testResource, pm) {
        return whenCB(store);
    }
}
exports.MockWhen = MockWhen;
