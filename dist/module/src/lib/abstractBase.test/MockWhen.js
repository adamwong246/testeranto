/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseWhen } from "../BaseWhen";
export class MockWhen extends BaseWhen {
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
