import { app, BrowserWindow, utilityProcess, ipcMain } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { jsonc } from "jsonc";
import { v4 as uuidv4 } from "uuid";

import { IBuiltConfig, IRunTime } from "./lib/types";

const nodeChildren: Record<string, Electron.UtilityProcess> = {};
const webChildren: Record<string, BrowserWindow> = {};
const node2web: Record<string, string[]> = {};
const web2node: Record<string, string[]> = {};

process.on("message", function (message) {
  console.log("message: " + message);
  process.exit();
});

const remoteMain = require("@electron/remote/main");

remoteMain.initialize();

const main = async () => {
  const configs = jsonc.parse(
    (await fs.readFileSync("./docs/testeranto.json")).toString()
  ) as IBuiltConfig;

  const loadReport = (configs: IBuiltConfig) => {
    const win = new BrowserWindow({
      show: true,
      webPreferences: {
        offscreen: false,
        devTools: true,
      },
    });

    win.loadFile(`/${configs.buildDir}/report.html`).then(async (x) => {
      // pie.connect(app, puppeteer).then(async (browser) => {
      //   pie.getPage(browser, win).then(async (page) => {
      //     await page.screenshot({
      //       path: 'electron-puppeteer-screenshot1.jpg'
      //     });
      //   })
      // })
    });
  };

  const launchNode = (src: string, dest: string) => {
    console.log("launchNode", src);
    const destFolder = dest.replace(".mjs", "");

    const argz = JSON.stringify({
      scheduled: true,
      name: src,
      ports: [3333],
      // fs: path.resolve(configs.buildDir, "web", destFolder + "/"),
      // fs: destFolder,
      fs: ".",
    });

    // console.log("launchNode", src, dest, " -> ", destFolder, argz);

    const child = utilityProcess.fork(dest + ".mjs", [argz], {
      cwd: destFolder,
      stdio: "pipe",
    });
    const nodeGuid = uuidv4();
    nodeChildren[nodeGuid] = child;

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    const stdout = fs.createWriteStream(`${destFolder}/stdout.log`);
    const stderr = fs.createWriteStream(`${destFolder}/stderr.log`);

    child
      .on("message", (data) => {
        console.log("from child", JSON.stringify(data));
        if (data.launchWeb) {
          const guid = uuidv4();
          const webChild = launchWebSecondary(process.cwd() + data.launchWeb);
          // child.postMessage({ webLaunched: guid });

          webChild.webContents.on("did-finish-load", () => {
            // webChild.webContents.send("message", "hello world");
            child.postMessage({ webLaunched: guid });
            webChildren[guid] = webChild;
            node2web[nodeGuid] = [...(node2web[nodeGuid] || []), guid];
          });
        }
        if (data.teardown) {
          webChildren[data.teardown].close();
          delete webChildren[data.teardown];
          node2web[nodeGuid] = node2web[nodeGuid].filter(
            (x) => x !== data.teardown
          );
        }
      })
      .on("exit", (data) => {
        stdout.close();
        stderr.close();
      });

    child.stdout?.pipe(stdout);
    child.stderr?.pipe(stderr);
  };

  const launchWebSecondary = (htmlFile: string): BrowserWindow => {
    console.log("launchWebSecondary", htmlFile);
    const subWin = new BrowserWindow({
      show: true,

      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        preload: path.join(app.getAppPath(), "preload.js"),
        offscreen: false,
        devTools: true,
      },
    });
    remoteMain.enable(subWin.webContents);
    subWin.webContents.openDevTools();
    subWin.loadFile(htmlFile);
    return subWin;

    // const uuid = uuidv4();
    // windows[uuid] = subWin;
    // return uuid;
  };

  const launchWeb = (t: string, dest: string) => {
    console.log("launchWeb", t);
    const destFolder = dest.replace(".mjs", "");

    const subWin = new BrowserWindow({
      show: true,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        preload: path.join(app.getAppPath(), "preload.js"),
        offscreen: false,
        devTools: true,
      },
    });

    webChildren[uuidv4()] = subWin;

    remoteMain.enable(subWin.webContents);

    const webArgz = JSON.stringify({
      name: dest,
      ports: [].toString(),
      // fs: path.resolve(configs.buildDir, "web", destFolder + "/"),
      // fs: destFolder,
      fs: destFolder,
    });

    // console.log("webArgz", webArgz);
    subWin.loadFile(`${dest}.html`, {
      query: {
        requesting: encodeURIComponent(webArgz),
      },
    });

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    const stdout = fs.createWriteStream(`${destFolder}/stdout.log`);

    subWin.webContents.on(
      "console-message",
      (event, level, message, line, sourceId) => {
        stdout.write(
          JSON.stringify(
            {
              event,
              level,
              message: JSON.stringify(message),
              line,
              sourceId,
            },
            null,
            2
          )
        );
        stdout.write("\n");
      }
    );
    subWin.on("closed", () => {
      console.log(" ---- Bye Bye Electron ---- ");
      stdout.close();
    });
    ipcMain.on("message", (message, data) => {
      console.log("ipcMain message: " + JSON.stringify(data));
      // process.exit();
    });

    // child.on('message', (data) => {
    //   console.log("from child", data);
    //   launchWebSecondary(process.cwd() + data);
    // }).on('exit', (data) => {
    //   fs.writeFileSync(`${destFolder}/stdout.log`, data.toString());
    //   stdout.close();
    //   stderr.close();
    // })

    // child.stdout?.pipe(stdout);
    // child.stderr?.pipe(stderr);
  };

  const watcher = (test: string, runtime: IRunTime) => {
    return path.normalize(
      `${configs.buildDir}/${runtime}/${test
        .split(".")
        .slice(0, -1)
        .concat("mjs")
        .join(".")}`
    );
  };

  const changer = (f: string) => {
    return path.normalize(`${configs.buildDir}/${f}`);
  };

  const changer2 = (f: string, r: IRunTime) => {
    return path
      .normalize(`${configs.buildDir}/${r}/${f}`)
      .split(".")
      .slice(0, -1)
      .join(".");
  };

  pie.initialize(app, 2999).then(async () => {
    app.on("ready", () => {
      loadReport(configs);

      console.log("running all the tests once initially");
      configs.tests.forEach(([test, runtime, secondaryArtifacts]) => {
        if (runtime === "node") {
          launchNode(test, changer2(test, "node"));
        } else if (runtime === "web") {
          launchWeb(test, changer2(test, "web"));
        } else {
          console.error("runtime makes no sense", runtime);
        }
      });

      console.log("ready and watching for changes...", configs.buildDir);
      fs.watch(
        configs.buildDir,
        {
          recursive: true,
        },
        (eventType, changedFile) => {
          if (changedFile) {
            configs.tests.forEach(([test, runtime, secondaryArtifacts]) => {
              // console.log(eventType, changedFile, test);

              if (eventType === "change") {
                // console.log(
                //   eventType,
                //   changedFile,
                //   test
                //     .replace("./", "node/")
                //     .split(".")
                //     .slice(0, -1)
                //     .concat("mjs")
                //     .join(".")
                // );
                if (
                  changedFile ===
                  test
                    .replace("./", "node/")
                    .split(".")
                    .slice(0, -1)
                    .concat("mjs")
                    .join(".")
                ) {
                  launchNode(test, changer2(test, "node"));
                }

                if (
                  changedFile ===
                  test
                    .replace("./", "web/")
                    .split(".")
                    .slice(0, -1)
                    .concat("mjs")
                    .join(".")
                ) {
                  launchNode(test, changer2(test, "web"));
                }
              }
              //   if(changedFile ===)
              //   // if (watcher(test, runtime) === changer(test)) {
              //   //   if (runtime === "node") {
              //   //     launchNode(test, changer2(test, "node"));
              //   //   } else if (runtime === "web") {
              //   //     launchWeb(test, changer2(test, "web"));
              //   //   } else {
              //   //     console.error("runtime makes no sense", runtime);
              //   //   }
              //   // }
            });
          }
        }
      );
    });
  });
  await pie.connect(app, puppeteer);
};

main();
