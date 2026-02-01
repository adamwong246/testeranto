import { ITestconfigV2 } from "../../../Types";
export declare const rubyDockerComposeFile: (config: ITestconfigV2, container_name: string, projectConfigPath: string, rubyConfigPath: string, testName: string) => {
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
export declare const rubyBuildCommand: (projectConfigPath: string, rubyConfigPath: string, testName: string) => string;
export declare const rubyBddCommand: (fpath: string) => string;
