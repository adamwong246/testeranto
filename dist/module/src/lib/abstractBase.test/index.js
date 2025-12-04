/* eslint-disable @typescript-eslint/no-empty-object-type */
import Tiposkripto from "../../Tiposkripto";
import { testAdapter } from "./adapter";
import { implementation } from "./implementation";
import { MockGiven } from "./MockGiven";
import { MockThen } from "./MockThen";
import { MockWhen } from "./MockWhen";
import { specification } from "./specification";
export default Tiposkripto({
    MockGiven,
    MockWhen,
    MockThen,
}, specification, implementation, testAdapter);
