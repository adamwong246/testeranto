import { FileService, FileEntry, FileStatus, FileChange, RemoteStatus } from "../FileService";
export declare class GitFileService extends FileService {
    private git;
    private fs;
    private dir;
    files(path: string): Promise<object>;
    projects(project: string): Promise<object>;
    tests(project: string): Promise<object>;
    report(project: string, test: string): Promise<object>;
    fsTree(path: string): Promise<object>;
    projectTree(project: string): Promise<object>;
    private ensureGit;
    private ensureBufferPolyfill;
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
    getRemoteStatus(): Promise<RemoteStatus>;
}
