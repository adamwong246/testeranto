import Testeranto from "testeranto-react/src/react-dom/component/web";
import { MemoryRouter } from "react-router-dom";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { FeaturesReporterView } from "../FeaturesReporterView";
import React from "react";

const WrappedFeaturesReporterView = (props) => (
  <MemoryRouter>
    <FeaturesReporterView {...props} />
  </MemoryRouter>
);

export default Testeranto(
  implementation,
  specification,
  WrappedFeaturesReporterView
);
