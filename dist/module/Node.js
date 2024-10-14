// const remote = require('@electron/remote')
import Testeranto from "./lib/core.js";
import { defaultTestResourceRequirement, } from "./lib/index.js";
import { NodeWriter } from "./NodeWriter.js";
class NodeTesteranto extends Testeranto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, NodeWriter, testInterface);
        const t = this.testJobs[0];
        const testResourceArg = process.argv[2] || `{}`;
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            this.receiveTestResourceConfig(t, partialTestResource);
        }
        catch (e) {
            console.error(e);
            process.exit(-1);
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        // var window = remote.getCurrentWindow();
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            process.exit(await failed ? 1 : 0);
        });
    }
}
;
export default async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
    return new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
// export default async <
//   ITestShape extends IBaseTest,
// >(
//   input: ITestShape['iinput'],
//   testSpecification: ITestSpecification<ITestShape>,
//   testImplementation: ITestImplementation<ITestShape, object>,
//   testInterface: Partial<ITestInterface<ITestShape>>,
//   testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
// ) => {
//   new NodeTesteranto<ITestShape>(
//     input,
//     testSpecification,
//     testImplementation,
//     testResourceRequirement,
//     testInterface,
//   )
// };
