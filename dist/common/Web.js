"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("./lib/core"));
const lib_1 = require("./lib");
// import { NodeWriterElectron } from "./nodeWriterElectron";
const remote = require('@electron/remote');
// import electron from '@electron/remote';
// const electron = require('electron')
// const remote = electron.remote;
// const path = require('path')
// const BrowserWindow = electron.remote.BrowserWindow
class WebTesteranto extends core_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
        super(input, testSpecification, testImplementation, testResourceRequirement, window.NodeWriter, testInterface);
        const t = this.testJobs[0];
        const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get('requesting') || '');
        try {
            const partialTestResource = JSON.parse(testResourceArg);
            console.log("initial test resource", partialTestResource);
            this.receiveTestResourceConfig(t, partialTestResource);
        }
        catch (e) {
            console.error(e);
            // process.exit(-1);
        }
    }
    async receiveTestResourceConfig(t, partialTestResource) {
        const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
        Promise.all([...artifacts, logPromise]).then(async () => {
            var window = remote.getCurrentWindow();
            window.close();
            // debugger
            // // ipcRenderer.invoke('quit-app', failed);
            // // (window as any).exit(failed)
            // let win = new BrowserWindow({ width: 800, height: 600 })
            // win.loadURL('https://github.com')
        });
    }
}
;
exports.default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = lib_1.defaultTestResourceRequirement) => {
    return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};
