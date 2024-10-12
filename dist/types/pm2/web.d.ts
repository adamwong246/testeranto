import pm2 from "pm2";
import { IBaseConfig } from "../Types";
declare const _default: (args: string, inputFilePath: string, watch: string, config: IBaseConfig) => pm2.StartOptions;
export default _default;
