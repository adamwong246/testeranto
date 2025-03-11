import express from "express";
import puppeteer from "puppeteer-core";

const puppeteerOption = {
  // timeout: 1,
  waitForInitialPage: false,
  executablePath:
    // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
    "/opt/homebrew/bin/chromium",
  headless: false,
  dumpio: true,
  // timeout: 0,
  args: [
    "--auto-open-devtools-for-tabs",
    `--remote-debugging-port=3234`,

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
    "--unsafely-treat-insecure-origin-as-secure=*",
    // "--disable-features=IsolateOrigins",
    // "--remote-allow-origins=ws://localhost:3234",
    // "--single-process",
    // "--unsafely-treat-insecure-origin-as-secure",
    // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",

    // "--disk-cache-dir=/dev/null",
    // "--disk-cache-size=1",
    // "--start-maximized",
  ],
};

const main = async () => {
  const app = express();
  const port = 3000;

  app.use(express.static("dist/scratch"));
  // app.get('/', (req, res) => {
  //   res.sendFile(process.cwd() + '/scratch/index.html');
  // });

  app.listen(port, async () => {
    console.log(`Server listening at http://localhost:${port}`);
    const browser = await puppeteer.launch(puppeteerOption);

    const p = await browser.newPage();
    await p.goto("http://localhost:3000");
  });
};
main();
