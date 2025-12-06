export declare const FileService_methods: string[];
export declare abstract class FileService {
    abstract writeFile_send(...x: any[]): any;
    abstract writeFile_receive(...x: any[]): any;
    abstract readFile_receive(...x: any[]): any;
    abstract readFile_send(...x: any[]): any;
    abstract createDirectory_receive(...x: any[]): any;
    abstract createDirectory_send(...x: any[]): any;
    abstract deleteFile_receive(...x: any[]): any;
    abstract deleteFile_send(...x: any[]): any;
    abstract files_send(...x: any[]): any;
    abstract files_receive(...x: any[]): any;
    abstract projects_send(...x: any[]): any;
    abstract projects_receive(...x: any[]): any;
    abstract tests_send(...x: any[]): any;
    abstract tests_receive(...x: any[]): any;
    abstract report_send(...x: any[]): any;
    abstract report_receive(...x: any[]): any;
}
export interface FileEntry {
    name: string;
    path: string;
    type: "file" | "directory";
    size?: number;
    modified?: Date;
}
export interface FileStatus {
    status: "unchanged" | "modified" | "added" | "deleted" | "conflicted";
}
export interface FileChange extends FileStatus {
    path: string;
    diff?: string;
}
export interface RemoteStatus {
    ahead: number;
    behind: number;
}
