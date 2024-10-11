import { testInterface } from ".";
import test from "../../../Node";
export default (testImplementations, testSpecifications, testInput) => {
    return test(testInput, testSpecifications, testImplementations, testInterface);
};
