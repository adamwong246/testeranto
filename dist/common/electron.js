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
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
        },
        width: 800,
        height: 600,
    });
    win.loadURL(url_1.default.format({
        pathname: path_1.default.join(process.cwd(), process.argv[2]),
        protocol: "file:",
        slashes: true,
    }));
}
electron_1.app.on("ready", createWindow);
