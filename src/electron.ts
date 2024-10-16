import { app, BrowserWindow, utilityProcess } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { IBuiltConfig, IJsonConfig, IRunTime, ITestTypes } from "./Types";
import fs from "fs";
import path from "path";
import { jsonc } from 'jsonc';

const remoteMain = require("@electron/remote/main");

remoteMain.initialize();

const main = async () => {

  const configs = jsonc.parse(
    (await fs.readFileSync("./docs/testeranto.json")).toString()
  ) as IBuiltConfig;

  const loadReport = (configs: IBuiltConfig) => {
    const win = new BrowserWindow(
      {
        show: true,
        webPreferences: {
          offscreen: false,
          devTools: true,
        }
      }
    );

    win.loadFile(`/${configs.buildDir}/report.html`).then(async (x) => {
      // pie.connect(app, puppeteer).then(async (browser) => {
      //   pie.getPage(browser, win).then(async (page) => {
      //     await page.screenshot({
      //       path: 'electron-puppeteer-screenshot1.jpg'
      //     });
      //   })
      // })
    })
  }

  const launchNode = (t: string, x: string) => {
    const f = x.replace(".ts", ".mjs");

    const a = JSON.stringify(
      {
        scheduled: true,
        name: x,
        ports: [],
        fs:
          path.resolve(
            configs.buildDir,
            "node",
            t,
          ),
      }
    )
    console.log("launchNode", f, a);

    const child = utilityProcess.fork(f, [a], {});
    child.postMessage({ message: 'hello' })
    child.on('message', (data) => {
      console.log("from child", data);
      launchWebSecondary(process.cwd() + data);
    })
    child.on('exit', (data) => {
      console.log("node process ended with: ", data);
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

  const launchWeb = (t: string, changedFile: string) => {
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
          devTools: true,
        }
      }

    )
    remoteMain.enable(subWin.webContents);
    // subWin.webContents.openDevTools()

    const htmlFile = changedFile.split(".").slice(0, -1).concat("html").join(".")

    subWin.loadFile(htmlFile, {
      query: {
        requesting: encodeURIComponent(JSON.stringify({
          name: changedFile,
          ports: [].toString(),
          fs:
            path.resolve(
              configs.buildDir,
              "web",
              t,
            ),
        }
        ))
      }
    })

  }

  const watcher = (test: string, runtime: IRunTime) => {
    return path.normalize(
      `${configs.buildDir}/${runtime}/${test.split('.').slice(0, -1).concat('mjs').join('.')}`
    );
  };

  const changer = (f: string) => {
    return path.normalize(`${configs.buildDir}/${f}`);
  };
  const changer2 = (f: string, r: IRunTime) => {
    return path.normalize(`${configs.buildDir}/${r}/${f}`);
  };

  pie.initialize(app, 2999).then(async () => {

    app.on("ready", () => {
      loadReport(configs);

      console.log("running all the tests once initially");;
      configs.modules.forEach((t) => {
        if (t.runtime === "node") {
          launchNode(t.test, changer2(t.test, "node"));
        } else if (t.runtime === "web") {
          launchWeb(t.test, changer2(t.test, "web"));
        } else {
          console.error("runtime makes no sense", t.runtime);
        }
      })


      console.log("ready and watching for changes...", configs.buildDir);
      fs.watch(configs.buildDir, {
        recursive: true,
      }, (eventType, changedFile) => {
        console.log(eventType, changedFile);
        if (changedFile) {
          configs.modules.forEach((t) => {
            if (watcher(t.test, t.runtime) === changer(changedFile)) {
              if (t.runtime === "node") {
                launchNode(t.test, changer(changedFile))
              } else if (t.runtime === "web") {
                launchWeb(t.test, changer(changedFile))
              } else {
                console.error("runtime makes no sense", t.runtime);
              }
            }
          })
        }

      })
    });
  });

  await pie.connect(app, puppeteer);

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
