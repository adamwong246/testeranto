import Testeranto from "testeranto-react/src/react-dom/component/web";
import { MemoryRouter } from "react-router-dom";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { ProjectPageView } from "../ProjectPageView";
import React from "react";
const WrappedProjectPageView = (props) => (React.createElement(MemoryRouter, null,
    React.createElement(ProjectPageView, Object.assign({}, props), " ")));
export default Testeranto(implementation, specification, WrappedProjectPageView);
