import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";
let win;
function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            offscreen: true,
            devTools: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            preload: path.join(app.getAppPath(), 'preload.js'),
            sandbox: false
        },
        width: 800,
        height: 600,
        show: true,
    });
    const u = url.format({
        pathname: path.join(process.cwd(), process.argv[2]),
        protocol: "file:",
        slashes: true,
        query: {
            requesting: encodeURIComponent(process.argv[3]),
        }
    });
    console.log("loading", u);
    win.loadURL(u);
    win.webContents.openDevTools();
}
app.on("ready", createWindow);
ipcMain.handle('web-log', (x, message) => {
    console.log("web-log)", message);
});
ipcMain.handle('web-error', (x, message) => {
    console.log("web-error)", message);
});
ipcMain.handle('web-warn', (x, message) => {
    console.log("web-warn)", message);
});
ipcMain.handle('web-info', (x, message) => {
    console.log("web-info)", message);
});
ipcMain.handle('quit-app', (x, failed) => {
    console.log("quit-app", failed);
    app.exit(failed);
});
