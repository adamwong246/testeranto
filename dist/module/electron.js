import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";
// console.log("hello electron", process.argv);
// console.log("hello electron stdin", process.stdin); works
// console.log("hello electron send", process.send); does not work
let win;
function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            preload: path.join(app.getAppPath(), 'preload.js'),
            sandbox: false
        },
        width: 800,
        height: 600,
        show: false,
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
    // win.webContents
    win.webContents.openDevTools();
}
app.on("ready", createWindow);
ipcMain.handle('quit-app', (x, failed) => {
    console.log("quit-app", failed);
    app.exit(failed ? 1 : 0);
});
