import { IConfig } from "../../../Types";
export declare const pythonDockerComposeFile: (config: IConfig, container_name: string, fpath: string) => {
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
export declare const pythonBuildCommand: (fpath: string) => string;
export declare const pythonBddCommand: (fpath: string) => string;
