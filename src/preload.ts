import { NodeWriter } from "./NodeWriter";
import { app, ipcRenderer } from "electron";

// console.log("hello preload", process.argv);
// console.log("hello preload send", process.send);

(window as any).NodeWriter = NodeWriter;
(window as any).exit = (x) => {
  ipcRenderer.invoke('quit-app', x);
}

