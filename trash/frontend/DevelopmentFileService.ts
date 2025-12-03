/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */

import lfs from "@isomorphic-git/lightning-fs";
import git from "isomorphic-git";

import { FileService } from "../FileService";

export class DevelopmentFileService extends FileService {
  private ws: WebSocket;

  public fs = new lfs("testfs");

  readonly connected: boolean = false;

  constructor() {
    super();
  }

  setSocket(ws: WebSocket) {
    this.ws = ws;

    this.ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.data[0] === `createDirectory`) {
        this.createDirectory_receive(ev.data[1]);
      }

      if (m.data[0] === `deleteFile`) {
        this.deleteFile_receive(ev.data[1]);
      }

      if (m.data[0] === `writeFile`) {
        this.writeFile_receive(ev.data[1][0], ev.data[1][1]);
      }

      if (m.data[0] === `readFile`) {
        this.readFile_receive(ev.data[1][0], ev.data[1][1]);
      }

      if (m.data[0] === `files`) {
        this.files_receive(ev.data[1][0]);
      }

      if (m.data[0] === `projects`) {
        this.projects_receive(ev.data[1][0]);
      }

      if (m.data[0] === `tests`) {
        this.tests_receive(ev.data[1][0]);
      }

      if (m.data[0] === `report`) {
        this.report_receive(ev.data[1][0]);
      }
    };

    this.files_send();
  }

  createDirectory_send(s: string) {
    this.ws.send([`createDirectory`, s].toString());
  }
  createDirectory_receive(x: any[]) {
    this.fs.mkdir(x[1], { mode: 1 }, () => {});
  }

  deleteFile_send(s: string) {
    this.ws.send([`deleteFile`, s].toString());
  }
  deleteFile_receive(s: string) {
    this.fs.unlink(s, undefined, () => {});
  }

  writeFile_send(f: string, c: string) {
    this.ws.send([`writeFile`, f, c].toString());
  }
  writeFile_receive(s: string, c: string) {
    this.fs.writeFile(s, c, undefined, () => {});
  }

  readFile_send(f: string) {
    this.ws.send([`readFile`, f].toString());
  }
  readFile_receive(f: string, c: string) {
    this.fs.writeFile(f, c, undefined, () => {});
  }

  files_send() {
    this.ws.send([`files`].toString());
  }
  files_receive(files: string[]) {
    throw new Error("Method not implemented.");
  }

  projects_send() {
    this.ws.send([`projects`].toString());
  }
  projects_receive(tests: string[]) {
    throw new Error("Method not implemented.");
  }

  tests_send(project: string) {
    this.ws.send([`tests`].toString());
  }
  tests_receive(tests: any[]) {
    throw new Error("Method not implemented.");
  }

  report_send(project: string, test: string) {
    this.ws.send([`report`, [project, test]].toString());
  }
  report_receive(tests: string[]): Promise<object> {
    throw new Error("Method not implemented.");
  }
}
