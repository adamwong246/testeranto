"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeWriter_1 = require("./NodeWriter");
const electron_1 = require("electron");
window.NodeWriter = NodeWriter_1.NodeWriter;
window.exit = (x) => {
    electron_1.ipcRenderer.invoke('quit-app', x);
};
