import lfs from "@isomorphic-git/lightning-fs";
import { FileService } from "../FileService";
export declare class DevelopmentFileService extends FileService {
    private ws;
    fs: lfs;
    readonly connected: boolean;
    constructor();
    setSocket(ws: WebSocket): void;
    createDirectory_send(s: string): void;
    createDirectory_receive(x: any[]): void;
    deleteFile_send(s: string): void;
    deleteFile_receive(s: string): void;
    writeFile_send(f: string, c: string): void;
    writeFile_receive(s: string, c: string): void;
    readFile_send(f: string): void;
    readFile_receive(f: string, c: string): void;
    files_send(): void;
    files_receive(files: string[]): void;
    projects_send(): void;
    projects_receive(tests: string[]): void;
    tests_send(project: string): void;
    tests_receive(tests: any[]): void;
    report_send(project: string, test: string): void;
    report_receive(tests: string[]): Promise<object>;
}
