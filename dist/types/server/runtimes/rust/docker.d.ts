import { IConfig } from "../../../Types";
export declare const rustDockerComposeFile: (config: IConfig, container_name: string, fpath: string) => {
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
export declare const rustBuildCommand: (fpath: string) => string;
export declare const rustBddCommand: (fpath: string) => string;
