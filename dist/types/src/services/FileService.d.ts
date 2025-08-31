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
export interface FileService {
    readFile(path: string): Promise<string>;
    readDirectory(path: string): Promise<FileEntry[]>;
    exists(path: string): Promise<boolean>;
    writeFile(path: string, content: string): Promise<void>;
    createDirectory(path: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    getFileStatus(path: string): Promise<FileStatus>;
    getChanges(): Promise<FileChange[]>;
    commitChanges(message: string, description?: string): Promise<void>;
    pushChanges(): Promise<void>;
    pullChanges(): Promise<void>;
    getCurrentBranch(): Promise<string>;
    getRemoteStatus(): Promise<{
        ahead: number;
        behind: number;
    }>;
}
export declare const getFileService: (mode: "static" | "dev" | "git") => FileService;
