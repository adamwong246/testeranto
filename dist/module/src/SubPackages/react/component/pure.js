import Testeranto from "../../../Pure.js";
import { reactInterfacer } from "./index.js";
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, reactInterfacer(testInput));
};
