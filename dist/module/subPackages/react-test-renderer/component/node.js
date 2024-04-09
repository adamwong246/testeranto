import Testeranto from "../../../Node";
import { testInterface } from "./index";
export default (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, testInterface);
