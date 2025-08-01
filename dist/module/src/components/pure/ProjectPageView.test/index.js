import Testeranto from "testeranto-react/src/react-dom/component/web";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { ProjectPageView } from "../ProjectPageView";
export default Testeranto(implementation, specification, ProjectPageView);
