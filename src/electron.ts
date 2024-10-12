import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";

import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";




// const window = new BrowserWindow();
// const url = "https://example.com/";
// await window.loadURL(url);

// const page = await pie.getPage(browser, window);
// console.log(page.url());
// window.destroy();

// let win: BrowserWindow;

// pie.initialize(app).then(async () => {
//   const browser = await pie.connect(app, puppeteer)
//   console.log("pie", pie);
//   pie.getPage(browser, win).then(async (page) => {
//     console.log("page", page);
//     await page.screenshot({
//       path: 'electron-puppeteer-screenshot.jpg'
//     });
//   })
// })

// function createWindow() {

//   // const browser = await pie.connect(app, puppeteer);

//   win = new BrowserWindow({
//     show: true,
//     webPreferences: {

//       // offscreen: true,
//       devTools: true,
//       nodeIntegration: true,
//       nodeIntegrationInWorker: true,
//       contextIsolation: false,
//       preload: path.join(app.getAppPath(), 'preload.js'),
//       sandbox: false

//     },
//     width: 800,
//     height: 600,
//   });
//   const u = url.format({
//     pathname: path.join(process.cwd(), process.argv[2]),
//     protocol: "file:",
//     slashes: true,
//     query: {
//       requesting: encodeURIComponent(process.argv[3]),
//     }
//   });
//   console.log("loading", u);
//   win.loadURL(u);
//   // debugger
//   win.webContents.openDevTools()
//   // const page = await pie.getPage(browser, window);
//   // console.log(page.url());
//   // window.destroy();
// }



// ipcMain.handle('web-log', (x, message: string) => {
//   console.log("web-log)", message);
// });

// ipcMain.handle('web-error', (x, message: string) => {
//   console.log("web-error)", message);
// });

// ipcMain.handle('web-warn', (x, message: string) => {
//   console.log("web-warn)", message);
// });

// ipcMain.handle('web-info', (x, message: string) => {
//   console.log("web-info)", message);
// });

// ipcMain.handle('quit-app', (x, failed: number) => {
//   console.log("quit-app", failed);
//   app.exit(failed);
// });

const main = () => {
  pie.initialize(app, 2999).then(async () => {

    app.on("ready", () => {
      console.log("ready");

      const win = new BrowserWindow(
        {
          show: false,

          webPreferences: {
            offscreen: false,
            devTools: true,
          }
        }

      );
      win.loadURL("https://www.reddit.com/").then(async (x) => {
        console.log("loaded", x);
        pie.connect(app, puppeteer).then(async (browser) => {
          console.log("connect", process.env);
          console.log("pages", await browser.pages())

          pie.getPage(browser, win).then(async (page) => {
            console.log("page", page);
            await page.screenshot({
              path: 'electron-puppeteer-screenshot.jpg'
            });
          })

        })

      })

    });








  })
  // const browser = await pie.connect(app, puppeteer);


  // win.webContents.openDevTools()
  // const url = "https://www.google.com/";
  // await win.loadURL(url);

  // console.log("pie", pie);
  // console.log("win", win);

  // const browser = await pie.connect(app, puppeteer);

  // console.log(await browser.pages());
  // const page = await pie.getPage(browser, win);
  // console.log(page.url());



  // window.destroy();
};


main();
// export { };
