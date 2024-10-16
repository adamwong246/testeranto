import { testInterface } from "./index.js";
import test from "../../../Web.js";
export default (testImplementations, testSpecifications, testInput, testInterface2 = testInterface) => {
    return test(testInput, testSpecifications, testImplementations, testInterface2);
};
