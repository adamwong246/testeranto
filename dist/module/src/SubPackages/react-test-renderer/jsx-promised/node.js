import test from "../../../Node";
import { testInterface } from ".";
export default (testImplementations, testSpecifications, testInput) => {
    return test(testInput, testSpecifications, testImplementations, testInterface);
};
