"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockThen = void 0;
const BaseThen_1 = require("../BaseThen");
class MockThen extends BaseThen_1.BaseThen {
    constructor(name, thenCB) {
        super(name, thenCB);
    }
    async butThen(store, thenCB, testResourceConfiguration, pm) {
        // The thenCB expects a selection, not the store directly
        // We need to extract the selection from the store
        const selection = { testSelection: store.testSelection };
        return thenCB(selection);
    }
}
exports.MockThen = MockThen;
