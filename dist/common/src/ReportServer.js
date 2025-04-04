"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_static_1 = __importDefault(require("node-static"));
const http_1 = __importDefault(require("http"));
const main = async () => {
    // var params = {
    //   port: 8080, // Set the server port. Defaults to 8080.
    //   host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    //   root: "docs", // Set root directory that's being served. Defaults to cwd.
    //   open: false, // When false, it won't load your browser by default.
    //   ignore: "scss,my/templates", // comma-separated string for paths to ignore
    //   file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    //   wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    //   // mount: [["/components", "./node_modules"]], // Mount a directory to a route.
    //   logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    //   middleware: [
    //     function (req, res, next) {
    //       next();
    //     },
    //   ], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
    // };
    // liveServer.start(params);
    const fileServer = new node_static_1.default.Server("docs");
    http_1.default
        .createServer(function (request, response) {
        request
            .addListener("end", function () {
            fileServer.serve(request, response);
        })
            .resume();
    })
        .listen(8080);
    console.log("Server running on port 8080");
    // const browser: Browser = (await puppeteer.launch({
    //   waitForInitialPage: false,
    //   executablePath: "/opt/homebrew/bin/chromium",
    //   headless: false,
    //   devtools: false,
    //   args: [
    //     // "--disable-features=IsolateOrigins,site-per-process",
    //     "--disable-site-isolation-trials",
    //     "--allow-insecure-localhost",
    //     "--allow-file-access-from-files",
    //     "--allow-running-insecure-content",
    //     "--disable-dev-shm-usage",
    //     "--disable-extensions",
    //     "--disable-gpu",
    //     "--disable-setuid-sandbox",
    //     "--disable-site-isolation-trials",
    //     "--disable-web-security",
    //     "--no-first-run",
    //     "--no-sandbox",
    //     "--no-startup-window",
    //     // "--no-zygote",
    //     "--reduce-security-for-testing",
    //     "--remote-allow-origins=*",
    //     "--unsafely-treat-insecure-origin-as-secure=*",
    //     // "--disable-features=IsolateOrigins",
    //     // "--remote-allow-origins=ws://localhost:3234",
    //     // "--single-process",
    //     // "--unsafely-treat-insecure-origin-as-secure",
    //     // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
    //     // "--disk-cache-dir=/dev/null",
    //     // "--disk-cache-size=1",
    //     // "--start-maximized",
    //   ],
    // })) as any;
    // const p = browser.newPage();
    // (await p).goto(`http://localhost:8080/bigBoard.html`);
};
main();
