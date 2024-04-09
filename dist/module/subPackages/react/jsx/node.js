import Testeranto from "../../../Node";
import { testInterface } from "./index";
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, testInterface(testInput));
};
