import { NodeWriter } from "./NodeWriter";

import { ipcRenderer, contextBridge } from "electron";

const remote = require("@electron/remote");
// contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
// contextBridge.exposeInMainWorld("remote", remote);
// contextBridge.exposeInMainWorld("NodeWriter", NodeWriter);

(window as any).ipcRenderer = ipcRenderer;
(window as any).remote = remote;
(window as any).NodeWriter = NodeWriter;

console.log("hello preloader");

// (window as any).exit = (x) => {
//   ipcRenderer.invoke("quit-app", x);
// };

// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("electronAPI", {
//   openFile: () => ipcRenderer.invoke("dialog:openFile"),
// });

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
