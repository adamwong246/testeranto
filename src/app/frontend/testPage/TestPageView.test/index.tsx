import Testeranto from "testeranto-react/src/react-dom/jsx/web";

import React from "react";
import { MemoryRouter } from "react-router-dom";

import { implementation } from "./implementation";
import { specification } from "./specification";
import { TestPageView } from "../TestPageView";

import "./../../../App.scss";

const WrappedTestPageView = (props) => (
  <MemoryRouter>
    <TestPageView {...props} />
  </MemoryRouter>
);

export default Testeranto(
  implementation,
  specification,
  WrappedTestPageView
);
