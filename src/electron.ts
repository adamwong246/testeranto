import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";

let win: BrowserWindow;

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
  win.webContents.openDevTools()
}

app.on("ready", createWindow);

ipcMain.handle('web-log', (x, message: string) => {
  console.log("web-log)", message);
});

ipcMain.handle('web-error', (x, message: string) => {
  console.log("web-error)", message);
});

ipcMain.handle('web-warn', (x, message: string) => {
  console.log("web-warn)", message);
});

ipcMain.handle('web-info', (x, message: string) => {
  console.log("web-info)", message);
});

ipcMain.handle('quit-app', (x, failed: number) => {
  console.log("quit-app", failed);
  // app.exit(failed);
});

export { };
