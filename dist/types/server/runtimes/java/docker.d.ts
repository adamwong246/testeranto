import { IConfig } from "../../../Types";
export declare const javaDockerComposeFile: (config: IConfig, container_name: string, fpath: string) => {
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
export declare const javaBuildCommand: (fpath: string) => string;
export declare const javaBddCommand: (fpath: string) => string;
