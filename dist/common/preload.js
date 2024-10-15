"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log("hello preloader");
const NodeWriter_1 = require("./NodeWriter");
window.NodeWriter = NodeWriter_1.NodeWriter;
window.exit = (x) => {
    electron_1.ipcRenderer.invoke('quit-app', x);
};
// var oldLog = console.log;
// console.log = function (message) {
//   ipcRenderer.invoke('web-log', message.toString());
//   oldLog.apply(console, arguments);
// };
// var oldLog = console.error;
// console.error = function (message) {
//   ipcRenderer.invoke('web-error', message.toString());
//   oldLog.apply(console, arguments);
// };
// var oldLog = console.warn;
// console.warn = function (message) {
//   ipcRenderer.invoke('web-warn', message.toString());
//   oldLog.apply(console, arguments);
// };
// var oldLog = console.info;
// console.info = function (message) {
//   ipcRenderer.invoke('web-info', message.toString());
//   oldLog.apply(console, arguments);
// };
