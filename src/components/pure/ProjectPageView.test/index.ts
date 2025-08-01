import Testeranto from "testeranto-react/src/react-dom/component/web";

import { implementation } from "./implementation";
import { specification } from "./specification";
import { I, O } from "./types";
import { ProjectPageView } from "../ProjectPageView";

export default Testeranto<I, O>(implementation, specification, ProjectPageView);
