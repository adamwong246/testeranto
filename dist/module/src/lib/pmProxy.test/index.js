import Typoskripto from "../TipoSkripto";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { testAdapter } from "./adapter";
import { butThenProxy } from "../pmProxy";
export default new Typoskripto({
    butThenProxy,
}, specification, implementation, testAdapter);
