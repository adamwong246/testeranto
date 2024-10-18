import Testeranto from "../../../Web.js";
import { testInterface as baseInterface, } from "./index.js";
export default (testImplementations, testSpecifications, testInput, testInterface) => {
    return Testeranto(testInput, testSpecifications, testImplementations, Object.assign(Object.assign({}, baseInterface), testInterface));
};
