"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopmentFileService = void 0;
const lightning_fs_1 = __importDefault(require("@isomorphic-git/lightning-fs"));
const FileService_1 = require("../FileService");
class DevelopmentFileService extends FileService_1.FileService {
    constructor() {
        super();
        this.fs = new lightning_fs_1.default("testfs");
        this.connected = false;
    }
    setSocket(ws) {
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
    createDirectory_send(s) {
        this.ws.send([`createDirectory`, s].toString());
    }
    createDirectory_receive(x) {
        this.fs.mkdir(x[1], { mode: 1 }, () => { });
    }
    deleteFile_send(s) {
        this.ws.send([`deleteFile`, s].toString());
    }
    deleteFile_receive(s) {
        this.fs.unlink(s, undefined, () => { });
    }
    writeFile_send(f, c) {
        this.ws.send([`writeFile`, f, c].toString());
    }
    writeFile_receive(s, c) {
        this.fs.writeFile(s, c, undefined, () => { });
    }
    readFile_send(f) {
        this.ws.send([`readFile`, f].toString());
    }
    readFile_receive(f, c) {
        this.fs.writeFile(f, c, undefined, () => { });
    }
    files_send() {
        this.ws.send([`files`].toString());
    }
    files_receive(files) {
        throw new Error("Method not implemented.");
    }
    projects_send() {
        this.ws.send([`projects`].toString());
    }
    projects_receive(tests) {
        throw new Error("Method not implemented.");
    }
    tests_send(project) {
        this.ws.send([`tests`].toString());
    }
    tests_receive(tests) {
        throw new Error("Method not implemented.");
    }
    report_send(project, test) {
        this.ws.send([`report`, [project, test]].toString());
    }
    report_receive(tests) {
        throw new Error("Method not implemented.");
    }
}
exports.DevelopmentFileService = DevelopmentFileService;
