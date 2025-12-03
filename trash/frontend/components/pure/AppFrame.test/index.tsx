import React from "react";

import Testeranto from "testeranto-react/src/react-dom/component/web";

import { implementation } from "./implementation";
import { specification } from "./specification";
import { AppFrame } from "../AppFrame";


import "../../../App.scss";

const WrappedAppFrame: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div id="test-root">
    <AppFrame data-testid="app-frame">{children}</AppFrame>
  </div>
);

export default Testeranto(
  implementation,
  specification,
  WrappedAppFrame
);
