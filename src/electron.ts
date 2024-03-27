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
  win.webContents.openDevTools()
}

app.on("ready", createWindow);

ipcMain.handle('quit-app', (x, failed: boolean) => {
  console.log("quit-app", failed);
  app.exit(failed ? 1 : 0);
});

export { };
