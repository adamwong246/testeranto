import Testeranto from "../../../Pure.js";
import { testInterfacer } from "./static.js";
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, testInterfacer(testInput));
};
