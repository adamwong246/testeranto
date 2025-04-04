import ReactDom from "react-dom/client";
import React from "react";
// import { ClassicalComponent } from "./index";

const LittleBoard = () => {
  return <div>LittleBoard</div>
}

// class LittleBoard {

// }

// export function LittleBoard(): React.JSX.Element {
//   return <div>LittleBoard</div>
// }

function Parent({ children }) {
  return <div>{children}</div>;
}
document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Parent, { children: [] }));
  }
});

console.log("hello LittleBoard!")