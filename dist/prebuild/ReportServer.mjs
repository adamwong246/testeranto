// src/ReportServer.ts
import puppeteer from "puppeteer-core";
import staticServer from "node-static";
import http from "http";
var main = async () => {
  const fileServer = new staticServer.Server("docs");
  http.createServer(function(request, response) {
    request.addListener("end", function() {
      fileServer.serve(request, response);
    }).resume();
  }).listen(8080);
  console.log("Server running on port 8080");
  const browser = await puppeteer.launch({
    waitForInitialPage: false,
    executablePath: "/opt/homebrew/bin/chromium",
    headless: false,
    devtools: false,
    args: [
      // "--disable-features=IsolateOrigins,site-per-process",
      "--disable-site-isolation-trials",
      "--allow-insecure-localhost",
      "--allow-file-access-from-files",
      "--allow-running-insecure-content",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--disable-gpu",
      "--disable-setuid-sandbox",
      "--disable-site-isolation-trials",
      "--disable-web-security",
      "--no-first-run",
      "--no-sandbox",
      "--no-startup-window",
      // "--no-zygote",
      "--reduce-security-for-testing",
      "--remote-allow-origins=*",
      "--unsafely-treat-insecure-origin-as-secure=*"
      // "--disable-features=IsolateOrigins",
      // "--remote-allow-origins=ws://localhost:3234",
      // "--single-process",
      // "--unsafely-treat-insecure-origin-as-secure",
      // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
      // "--disk-cache-dir=/dev/null",
      // "--disk-cache-size=1",
      // "--start-maximized",
    ]
  });
  const p = browser.newPage();
  (await p).goto(`http://localhost:8080/bigBoard.html`);
};
main();
