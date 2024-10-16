import Testeranto from "../../../Web.js";
import { testInterface } from "./index.js";
export default (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, testInterface);
