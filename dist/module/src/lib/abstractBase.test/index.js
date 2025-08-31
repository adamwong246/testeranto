/* eslint-disable @typescript-eslint/no-empty-object-type */
import Testeranto from "../../Node";
import { specification } from "./specification";
import { implementation } from "./implementation";
import { testAdapter } from "./adapter";
import { MockGiven } from "./MockGiven";
import { MockThen } from "./MockThen";
import { MockWhen } from "./MockWhen";
export default Testeranto({
    MockGiven,
    MockWhen,
    MockThen,
}, specification, implementation, testAdapter);
