import Testeranto from "../../../Web";
import { testInterface } from ".";
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, testInterface(testInput));
};
