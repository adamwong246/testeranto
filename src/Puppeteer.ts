import puppeteer from 'puppeteer';

import { NodeWriter } from "./NodeWriter";

console.log("hello puppeteer send", process.send);
console.log("hello puppeteer stdin", process.stdin);

(async () => {

  puppeteer.launch({
    headless: false,
    devtools: true,
  }).then(async (browser) => {
    const page = await browser.newPage();
    await page.exposeFunction('NodeWriter', () => {
      console.log("printProcessSend process.send", process.send);
      console.log("NodeWriter", NodeWriter);
      return "IDK NodeWriter.startup";
    })
    await page.goto(`http://localhost:8000/${process.argv[2]}`)
    await page.setViewport({ width: 1080, height: 1024 });

    // console.log("process.send", process.send);
    // // Navigate the page to a URL
    // await page.goto('https://developer.chrome.com/');
    // await page.goto(`${process.argv[2]}`)
    // page.setContent(`
    //   <!DOCTYPE html>
    //       <html lang="en">
    //       <head>
    //         <script type="module">console.log("hello")</script>
    //       </head>

    //       <body>
    //         <div id="root">
    //           <pre>${JSON.stringify(process.argv, null, 2)}</pre>
    //         </div>
    //       </body>

    //       <footer></footer>

    //       </html>
    //   `, {
    //   waitUntil: ["load", "networkidle0"]
    // });


  })
})();