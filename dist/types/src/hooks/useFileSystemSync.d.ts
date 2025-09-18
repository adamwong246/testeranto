export interface FileEntry {
    name: string;
    type: "folder" | "file";
    path: string;
}
export interface FileSystemState {
    files: Record<string, FileEntry[]>;
    fileContents: Record<string, string>;
}
export declare const useFileSystemSync: (initialPath?: string) => {
    fileSystem: FileSystemState;
    listDirectory: (project: string) => Promise<any>;
    readFile: (path: string) => Promise<string>;
    refresh: () => Promise<any>;
};
