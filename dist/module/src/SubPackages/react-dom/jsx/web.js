import Testeranto from "../../../Web.js";
import { testInterfacer } from "./dynamic.js";
export default (testImplementations, testSpecifications, testInput) => {
    const t = Testeranto(testInput, testSpecifications, testImplementations, testInterfacer(testInput));
    document.addEventListener("DOMContentLoaded", function () {
        const rootElement = document.getElementById("root");
        if (rootElement) {
        }
    });
    return t;
};
