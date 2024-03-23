import { NodeWriter } from "./NodeWriter";
import { ipcRenderer } from "electron";
// console.log("hello preload", process.argv);
// console.log("hello preload send", process.send);
window.NodeWriter = NodeWriter;
window.exit = (x) => {
    ipcRenderer.invoke('quit-app', x);
};
