/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PM_Web } from "../PM/web";
import Tiposkripto from "./Tiposkripto";
import { defaultTestResourceRequirement, } from "./index.js";
export class WebTesteranto extends Tiposkripto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, (cb) => {
            // todo
        });
    }
    async receiveTestResourceConfig(partialTestResource) {
        const t = partialTestResource; //JSON.parse(partialTestResource);
        const pm = new PM_Web(t);
        return await this.testJobs[0].receiveTestResourceConfig(pm);
    }
}
export default async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
};
