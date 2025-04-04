import ReactDom from "react-dom/client";
import React from "react";
// import { ClassicalComponent } from "./index";
const LittleBoard = () => {
    return React.createElement("div", null, "LittleBoard");
};
// class LittleBoard {
// }
// export function LittleBoard(): React.JSX.Element {
//   return <div>LittleBoard</div>
// }
function Parent({ children }) {
    return React.createElement("div", null, children);
}
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(Parent, { children: [] }));
    }
});
console.log("hello LittleBoard!");
