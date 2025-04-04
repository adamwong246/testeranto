import ReactDom from "react-dom/client";
import React from "react";
// import { ClassicalComponent } from "./index";
const BigBoard = () => {
    return React.createElement("div", null, "BigBoard");
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}, []));
    }
});
console.log("hello BigBoard!");
