import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";

const p = puppeteer
  .connect({
    browserURL: "http://localhost:3234/json/version",
  })
  .then(async (b) => {
    console.log(await b.pages());
  });
