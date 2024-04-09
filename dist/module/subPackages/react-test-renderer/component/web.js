import Testeranto from "../../../Web";
import { testInterface } from "./index";
export default (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, testInterface);
