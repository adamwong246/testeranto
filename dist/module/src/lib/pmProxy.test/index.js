import Testeranto from "../../Node";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { testAdapter } from "./adapter";
import { butThenProxy } from "../pmProxy";
export default Testeranto({
    butThenProxy,
}, specification, implementation, testAdapter);
