import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";
let win;
function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
        },
        width: 800,
        height: 600,
    });
    win.loadURL(url.format({
        pathname: path.join(process.cwd(), process.argv[2]),
        protocol: "file:",
        slashes: true,
    }));
}
app.on("ready", createWindow);
