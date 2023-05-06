const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
let win;
console.log("mark", process.argv);
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
export {};
