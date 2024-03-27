import { NodeWriter } from "./NodeWriter";
import { ipcRenderer } from "electron";
window.NodeWriter = NodeWriter;
window.exit = (x) => {
    ipcRenderer.invoke('quit-app', x);
};
