import { NodeWriter } from "./NodeWriter";
import { ipcRenderer } from "electron";

(window as any).NodeWriter = NodeWriter;
(window as any).exit = (x) => {
  ipcRenderer.invoke('quit-app', x);
}

