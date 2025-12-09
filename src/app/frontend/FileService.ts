/* eslint-disable @typescript-eslint/no-explicit-any */

export const FileService_methods = [
  "writeFile_send",
  "writeFile_receive",
  "readFile_receive",
  "readFile_send",
  "createDirectory_receive",
  "createDirectory_send",
  "deleteFile_receive",
  "deleteFile_send",
  "files_send",
  "files_receive",
  "projects_send",
  "projects_receive",
  "tests_send",
  "tests_receive",
  "report_send",
  "report_receive",
];

export abstract class FileService {
  abstract writeFile_send(...x);
  abstract writeFile_receive(...x);

  abstract readFile_receive(...x);
  abstract readFile_send(...x);

  abstract createDirectory_receive(...x);
  abstract createDirectory_send(...x);

  abstract deleteFile_receive(...x);
  abstract deleteFile_send(...x);

  // returns a tree of filenames from the root of the project, disregarding any that match the ignore patterns
  abstract files_send(...x);
  abstract files_receive(...x);

  // return the list of all projects via `testeranto/projects.json`
  abstract projects_send(...x);
  abstract projects_receive(...x);

  // returns a list of tests for a project
  abstract tests_send(...x);
  abstract tests_receive(...x);

  // - returns a report for test 'Some_Test' in project 'core'. Each key maps to it's place in the filesystem
  //   - tests.json
  //   - stdout.log
  //   - stderr.log
  //   - exit.log
  //   - message.txt
  //   - prompt.txt
  //   - other/
  //     - all other reports/logs....
  //   - source/
  //     - a tree of the source files from the tests metafile...
  abstract report_send(...x);
  abstract report_receive(...x);

  // Git integration
  // getFileStatus(path: string): Promise<FileStatus>;
  // getChanges(): Promise<FileChange[]>;
  // commitChanges(message: string, description?: string): Promise<void>;
  // pushChanges(): Promise<void>;
  // pullChanges(): Promise<void>;
  // getCurrentBranch(): Promise<string>;
  // getRemoteStatus(): Promise<RemoteStatus>;
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
