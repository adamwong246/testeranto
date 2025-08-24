import { BaseThen } from "../BaseThen";
export class MockThen extends BaseThen {
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
