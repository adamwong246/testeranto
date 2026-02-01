import { BaseWhen } from "../BaseWhen";
export class MockWhen extends BaseWhen {
    constructor(name, whenCB) {
        super(name, whenCB);
    }
    async andWhen(store, whenCB, testResource) {
        // The whenCB returns a function that takes the store
        const result = whenCB(store);
        if (typeof result === "function") {
            return result(store);
        }
        return result;
    }
}
