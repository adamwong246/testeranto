import Testeranto from "../../../Node";
import { testInterface } from "./index";
export default (testImplementations, testSpecifications, testInput, testInterface2 = testInterface) => {
    return Testeranto(testInput, testSpecifications, testImplementations, testInterface2(testInput));
};
