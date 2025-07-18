import { BaseThen } from "../abstractBase";
export class MockThen extends BaseThen {
    constructor(name, thenCB) {
        super(name, thenCB);
    }
    async butThen(store, thenCB, testResourceConfiguration, pm) {
        return thenCB(store);
    }
}
