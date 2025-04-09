import test from "../../../Node.js";
import { testInterface } from "./index.js";
export default (testImplementations, testSpecifications, testInput, testInterface2 = testInterface) => {
    return test(testInput, testSpecifications, testImplementations, testInterface2);
};
