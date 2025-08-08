import Testeranto from "testeranto-react/src/react-dom/component/web";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { ModalContent } from "../ModalContent";
import React from "react";

const WrappedModalContent = (props) => (
  <ModalContent {...props} />
);

export default Testeranto(
  implementation,
  specification,
  WrappedModalContent
);
