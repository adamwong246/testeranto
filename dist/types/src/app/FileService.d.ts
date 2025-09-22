export declare enum ApiEndpoint {
    files = "/api/files/",
    projects = "/api/projects/",
    tests = "/api/projects/tests",
    report = "/api/report",
    health = "/api/health",
    write = "/api/files/write",
    read = "/api/files/read"
}
export declare abstract class FileService {
    abstract writeFile(path: string, content: string): Promise<void>;
    abstract readFile(path: string): Promise<string>;
    abstract createDirectory(path: string): Promise<void>;
    abstract deleteFile(path: string): Promise<void>;
    abstract files(path: string): Promise<object>;
    abstract projects(project: string): Promise<string[]>;
    abstract tests(project: string): Promise<string[]>;
    abstract report(project: string, test: string): Promise<object>;
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
