import puppeteer from "puppeteer-core";

import { NodeWriter } from "./NodeWriter";
import puppeteerConfiger from "./puppeteerConfiger";

(window as any).NodeWriter = NodeWriter;

(window as any).browser = new Promise(async (res, rej) => {
  const browser = await puppeteerConfiger("2999").then(async (json) => {
    const b = await puppeteer.connect({
      browserWSEndpoint: json.webSocketDebuggerUrl,
      defaultViewport: null,
    });
    console.log("connected!", b.isConnected());
    return res(b);
  });
});
