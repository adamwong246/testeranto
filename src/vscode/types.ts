export enum TreeItemType {
  Runtime,
  Test,
  File
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
