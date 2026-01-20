export declare enum TreeItemType {
    Runtime = 0,
    Test = 1,
    File = 2
}
export interface TreeItemData {
    runtime?: string;
    testName?: string;
    fileName?: string;
    path?: string;
    test?: string;
    status?: string;
    isFile?: boolean;
}
