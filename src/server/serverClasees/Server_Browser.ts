import { IMode } from "../types";
import { IBuiltConfig } from "../../Types";
import puppeteer from "puppeteer";
import { Server_Queue } from "./Server_Queue";

export class Server_Browser extends Server_Queue {
  browser: puppeteer.Browser;

  constructor(configs: IBuiltConfig, testName: string, mode: IMode) {
    super(configs, testName, mode);
  }

  async start() {
    this.browser = await puppeteer.launch({
      slowMo: 1,
      waitForInitialPage: false,

      defaultViewport: null, // Disable default 800x600 viewport
      dumpio: false,

      executablePath: "/opt/homebrew/bin/chromium",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920,1080",
        "--single-process", // May help in Docker
        "--no-zygote", // May help in Docker
      ],
      headless: "false", // Use new headless mode
    });
  }
}
