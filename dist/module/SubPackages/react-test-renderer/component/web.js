import Testeranto from "../../../Web.js";
import { testInterface } from "./interface";
export default (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, testInterface);
