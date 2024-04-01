"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            preload: path_1.default.join(electron_1.app.getAppPath(), 'preload.js'),
            sandbox: false
        },
        width: 800,
        height: 600,
        show: false,
    });
    const u = url_1.default.format({
        pathname: path_1.default.join(process.cwd(), process.argv[2]),
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
electron_1.app.on("ready", createWindow);
electron_1.ipcMain.handle('web-log', (x, message) => {
    console.log("web-log)", message);
});
electron_1.ipcMain.handle('web-error', (x, message) => {
    console.log("web-error)", message);
});
electron_1.ipcMain.handle('web-warn', (x, message) => {
    console.log("web-warn)", message);
});
electron_1.ipcMain.handle('web-info', (x, message) => {
    console.log("web-info)", message);
});
electron_1.ipcMain.handle('quit-app', (x, failed) => {
    console.log("quit-app", failed);
    electron_1.app.exit(failed);
});
