import { ITestconfigV2 } from "../../types";
export declare const nodeDockerComposeFile: (config: ITestconfigV2, container_name: string, projectConfigPath: string, nodeConfigPath: string, testName: string) => {
    build: {
        context: string;
        dockerfile: any;
    };
    container_name: string;
    environment: any;
    working_dir: string;
    volumes: string[];
    command: string;
};
export declare const nodeBuildCommand: (projectConfigPath: string, nodeConfigPath: string, testName: string) => string;
export declare const nodeBddCommand: (fpath: string, nodeConfigPath: string) => string;
