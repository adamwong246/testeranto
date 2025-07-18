"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockThen = void 0;
const abstractBase_1 = require("../abstractBase");
class MockThen extends abstractBase_1.BaseThen {
    constructor(name, thenCB) {
        super(name, thenCB);
    }
    async butThen(store, thenCB, testResourceConfiguration, pm) {
        return thenCB(store);
    }
}
exports.MockThen = MockThen;
