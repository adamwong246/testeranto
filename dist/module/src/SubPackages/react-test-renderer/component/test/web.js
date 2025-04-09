import test from "../web";
import component from "../../../../examples/react/component/index";
import { specification } from "../../../../examples/react/component/test";
import { testImplementation } from "./implementation";
export default test(testImplementation, specification, component);
