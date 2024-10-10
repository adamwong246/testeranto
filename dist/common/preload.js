"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const nodeWriter_js_1 = require("./nodeWriter.js");
window.NodeWriter = nodeWriter_js_1.NodeWriter;
window.exit = (x) => {
    electron_1.ipcRenderer.invoke('quit-app', x);
};
var oldLog = console.log;
console.log = function (message) {
    electron_1.ipcRenderer.invoke('web-log', message.toString());
    oldLog.apply(console, arguments);
};
var oldLog = console.error;
console.error = function (message) {
    electron_1.ipcRenderer.invoke('web-error', message.toString());
    oldLog.apply(console, arguments);
};
var oldLog = console.warn;
console.warn = function (message) {
    electron_1.ipcRenderer.invoke('web-warn', message.toString());
    oldLog.apply(console, arguments);
};
var oldLog = console.info;
console.info = function (message) {
    electron_1.ipcRenderer.invoke('web-info', message.toString());
    oldLog.apply(console, arguments);
};
