import { ITestconfigV2 } from "../../../Types";
export declare const golangDockerComposeFile: (config: ITestconfigV2, container_name: string) => object;
export declare const golangBuildCommand: () => string;
export declare const golangBddCommand: () => string;
export declare const golangTestCommand: (config: IBuiltConfig, inputfiles: string[]) => string;
