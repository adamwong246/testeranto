import { BaseWhen } from "../abstractBase";
export class MockWhen extends BaseWhen {
    constructor(name, whenCB) {
        super(name, whenCB);
    }
    async andWhen(store, whenCB, testResource, pm) {
        return whenCB(store);
    }
}
