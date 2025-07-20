import Testeranto from "../../Node";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { testAdapter } from "./adapter";
import { butThenProxy } from "../pmProxy";
export default Testeranto(
// because of the nature of testeranto, we must add all the testable items here
{
    butThenProxy,
}, specification, implementation, testAdapter);
