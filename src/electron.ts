import { app, BrowserWindow, utilityProcess } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { IJsonConfig, ITestTypes } from "./Types";
import fs from "fs";
import path from "path";
import { jsonc } from 'jsonc';

const remoteMain = require("@electron/remote/main");

remoteMain.initialize();

const main = async () => {

  const configs = jsonc.parse(
    (await fs.readFileSync("./testeranto.json")).toString()
  ) as IJsonConfig;

  const loadReport = (configs: IJsonConfig) => {
    const win = new BrowserWindow(
      {
        show: true,
        webPreferences: {
          offscreen: false,
          devTools: true,
        }
      }
    );

    win.loadFile(process.cwd() + `/${configs.outdir}/report.html`).then(async (x) => {
      // pie.connect(app, puppeteer).then(async (browser) => {
      //   pie.getPage(browser, win).then(async (page) => {
      //     await page.screenshot({
      //       path: 'electron-puppeteer-screenshot1.jpg'
      //     });
      //   })
      // })
    })
  }

  const launchNode = (t: ITestTypes, changedFile: string) => {

    const a = JSON.stringify(
      {
        scheduled: true,
        name: changedFile,
        ports: [],
        fs:
          path.resolve(
            process.cwd(),
            configs.outdir,
            "node",
            t[0],
          ),
      }
    )
    console.log("launchNode", changedFile, a);
    const child = utilityProcess.fork(changedFile, [a], {});
    child.postMessage({ message: 'hello' })
    child.on('message', (data) => {
      console.log("from child", data) // hello world!
      launchWebSecondary(process.cwd() + data);
    })
    child.on('exit', (data) => {
      console.log("exit from child", data);
      fileStream.close()
    })
    // child.stdout
    // child..on("", (data) => {
    //   console.log("from child", data) // hello world!
    //   launchWebSecondary(process.cwd() + data);
    // })
    // Create a write stream for the file
    const fileStream = fs.createWriteStream('errors.txt');

    // Pipe the child process's stdout to the file
    child.stdout?.pipe(fileStream);

    // // Handle errors
    // child.on('error', (err) => {
    //   console.error('Error spawning child process:', err);
    // });

    // fileStream.on('error', (err) => {
    //   console.error('Error writing to file:', err);
    // });

    // // Log a message when the child process exits
    // child.on('close', (code) => {
    //   console.log(`Child process exited with code ${code}`);
    // });
    // console.log("child", child);
    // child.stdout?.on("data", (x) => {
    //   console.log("x", x)
    // })
  }

  const launchWebSecondary = (htmlFile: string) => {
    console.log("launchWebSecondary", htmlFile)
    const subWin = new BrowserWindow(
      {
        show: true,

        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          contextIsolation: false,
          preload: path.join(app.getAppPath(), 'preload.js'),
          offscreen: false,
          devTools: false,
        }
      }

    )
    remoteMain.enable(subWin.webContents);
    subWin.webContents.openDevTools()
    subWin.loadFile(htmlFile);

  }

  const launchWeb = (t: ITestTypes, changedFile: string) => {
    console.log("launchWeb", changedFile)
    const subWin = new BrowserWindow(
      {
        show: true,

        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          contextIsolation: false,
          preload: path.join(app.getAppPath(), 'preload.js'),
          offscreen: false,
          devTools: false,
        }
      }

    )
    remoteMain.enable(subWin.webContents);
    // subWin.webContents.openDevTools()

    const htmlFile = changedFile.replace(".mjs", ".html");

    subWin.loadFile(htmlFile, {
      query: {
        requesting: encodeURIComponent(JSON.stringify({
          name: changedFile,
          ports: [].toString(),
          fs:
            path.resolve(
              process.cwd(),
              configs.outdir,
              "web",
              t[0],
            ),
        }
        ))
      }
    })

  }

  const watcher = (t: ITestTypes) => {
    return path.normalize(
      process.cwd() +
      `/${configs.outdir}/${t[1]}/${t[0].split('.').slice(0, -1).concat('mjs').join('.')}`
    );
  };

  const changer = (f: string) => {
    return path.normalize(process.cwd() + `/${configs.outdir}/${f}`);
  };

  pie.initialize(app, 2999).then(async () => {

    app.on("ready", () => {
      loadReport(configs);

      fs.watch(configs.outdir, {
        recursive: true,
      }, (eventType, changedFile) => {

        if (changedFile) {
          configs.tests.forEach((t) => {
            if (watcher(t) === changer(changedFile)) {
              if (t[1] === "node") {
                launchNode(t, changer(changedFile))
              } else {
                launchWeb(t, changer(changedFile))
              }
            }
          })
        }

      })
    });
  });

  const browser = await pie.connect(app, puppeteer);

};

main();

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

// process.stdin.on("data", (configTests) => {
//   main(JSON.parse(configTests.toString()) as ITestTypes[]);
// });

// const watchables = (tests: ITestTypes[]) => {
//   return tests.map((t) => {
//     return [t[1], `dist/${t[1]}/${t[0].replace(".mts", ".mjs")}`]
//   })
// }
