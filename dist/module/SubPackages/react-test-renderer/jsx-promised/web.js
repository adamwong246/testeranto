import test from "../../../Web";
import { testInterface } from "./index";
export default (testImplementations, testSpecifications, testInput) => {
    return test(testInput, testSpecifications, testImplementations, testInterface);
};
