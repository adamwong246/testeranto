import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";

console.log("hello electron stdin", process.stdin);
console.log("hello electron send", process.send);

let win;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      preload: path.join(app.getAppPath(), 'preload.js'),
      sandbox: false

    },
    width: 800,
    height: 600,
  });
  win.loadURL(
    url.format({
      pathname: path.join(process.cwd(), process.argv[2]),
      protocol: "file:",
      slashes: true,
    })
  );
}

app.on("ready", createWindow);

export { };
