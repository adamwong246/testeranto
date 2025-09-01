import React from "react";
import Testeranto from "testeranto-react/src/react-dom/component/web";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { AppFrame } from "../AppFrame";
import "../../../App.scss";
const WrappedAppFrame = ({ children }) => (React.createElement("div", { id: "test-root" },
    React.createElement(AppFrame, { "data-testid": "app-frame" }, children)));
export default Testeranto(implementation, specification, WrappedAppFrame);
