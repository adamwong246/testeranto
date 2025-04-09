import Testeranto from "../../../Node.js";
import { testInterfacer } from "./static.js";
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, testInterfacer(testInput));
};
