import { defaultTestResourceRequirement, } from "./core";
import TesterantoLevelTwo from "./core";
export default async (input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement = defaultTestResourceRequirement) => {
    const mrt = new TesterantoLevelTwo(input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement, testInterface.assertioner || (async (t) => t), testInterface.beforeEach ||
        async function (subject, initialValues, testResource) {
            return subject;
        }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => undefined), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler ||
        function (b) {
            return b;
        }, 
    // {
    //   createWriteStream: window.createWriteStream(),
    // }
    window.NodeWriter());
    const t = mrt[0];
    // const testResourceArg = `{"fs": ".", "ports": []}`;
    const testResourceArg = `{}`;
    try {
        const x = await window.NodeWriter();
        console.log("window.NodeWriter", x);
        await window.NodeWriter().startup(testResourceArg, t, testResourceRequirement);
    }
    catch (e) {
        console.error(e);
        // process.exit(-1);
    }
};
