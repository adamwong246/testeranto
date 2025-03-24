import Testeranto from "../../../Node.js";
import { testInterface as baseInterface, } from "./index.js";
export default (testImplementations, testSpecifications, testInput, testInterface = baseInterface) => {
    return Testeranto(testInput, testSpecifications, testImplementations, testInterface
    // {
    //   ...baseInterface,
    //   ...testInterface,
    // }
    );
};
