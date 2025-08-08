import Testeranto from "testeranto-react/src/react-dom/component/web";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { AppFrame } from "../AppFrame";
import React from "react";

import "../../../App.scss";

const WrappedAppFrame = (props) => (


  <AppFrame {...props} />
);

export default Testeranto(
  implementation,
  specification,
  WrappedAppFrame
);
