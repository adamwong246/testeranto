import Testeranto from "../../../Web.js";
export default (testInput, testSpecifications, testImplementations, testInterface) => {
    const t = Testeranto(testInput, testSpecifications, testImplementations, testInterface);
    document.addEventListener("DOMContentLoaded", function () {
        const elem = document.getElementById("root");
        if (elem) {
            return t;
        }
    });
    return t;
};
