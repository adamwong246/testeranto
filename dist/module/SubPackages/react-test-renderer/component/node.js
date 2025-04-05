import Testeranto from "../../../Node.js";
import { testInterface } from "./interface.js";
export default (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, testInterface);
