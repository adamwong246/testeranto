import { IConfig } from "../../../Types";
export declare const webDockerComposeFile: (config: IConfig, container_name: string, fpath: string) => {
    platform: string;
    build: {
        context: string;
        dockerfile: any;
    };
    container_name: string;
    environment: {};
    working_dir: string;
    volumes: string[];
    command: string;
};
export declare const webBuildCommand: (fpath: string) => string;
export declare const webBddCommand: (fpath: string) => string;
