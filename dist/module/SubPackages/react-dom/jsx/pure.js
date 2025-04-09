import Testeranto from "../../../Pure.js";
import { testInterface } from "./static.js";
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, testInterface);
};
