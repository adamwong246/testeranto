import test from "../../../Node";
import { testInterface } from "./index";
export default (testImplementations, testSpecifications, testInput, testInterface2 = testInterface) => {
    return test(testInput, testSpecifications, testImplementations, testInterface2);
};
