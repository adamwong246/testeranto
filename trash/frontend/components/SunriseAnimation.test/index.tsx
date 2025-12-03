import Testeranto from "testeranto-react/src/react-dom/component/web";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { SunriseAnimation } from "./SunriseAnimation";
import React from "react";

export default Testeranto(
  implementation,
  specification,
  SunriseAnimation
);
