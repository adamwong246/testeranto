import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  puppeteer_default,
  require_main
} from "../chunk-F2XSERHJ.mjs";
import "../chunk-SPCDJOVC.mjs";
import "../chunk-U3IOOGZ4.mjs";
import "../chunk-575CR37A.mjs";
import {
  testSpecification
} from "../chunk-DWQ3RVS7.mjs";
import {
  assert
} from "../chunk-NMBJLDFX.mjs";
import {
  Node_default
} from "../chunk-NXHDALJ3.mjs";
import "../chunk-KXYCS7SG.mjs";
import {
  __toESM
} from "../chunk-UDP42ARI.mjs";

// myTests/esbuild-puppeteer.testeranto.test.ts
var import_puppeteer_screen_recorder = __toESM(require_main());
import { PassThrough } from "stream";
var htmlTemplate = (jsBundle) => `
<!DOCTYPE html><html lang="en">
  <head>
    <script type="importmap">
      {
      "imports": {
        "main.js": "http://localhost:8000/${jsBundle}"
      }
    }
    </script>

    <script type="module" crossorigin="anonymous" src="http://localhost:8000/${jsBundle}"></script>
    <script type="module">
      import LaunchClassicalComponent from "main.js"
      LaunchClassicalComponent()
    </script>
  </head>

  <body>
    <div id="root">
    </div>
  </body>

  <footer></footer>
</html>`;
var EsbuildPuppeteerTesteranto = (testImplementations, testSpecifications, testInput) => Node_default(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeAll: async function(prebuilt, artificer) {
      const browser = await await puppeteer_default.launch({
        args: [
          "--disable-web-security",
          "--disable-features=IsolateOrigins",
          "--disable-site-isolation-trials"
        ],
        headless: true,
        devtools: false,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      });
      return new Promise((res, rej) => {
        res({
          browser,
          htmlBundle: htmlTemplate("./dist/src/ClassicalComponent.js")
        });
      });
    },
    beforeEach: async (subject, ndx, testResource, artificer) => {
      const page = await subject.browser.newPage();
      const recorder = new import_puppeteer_screen_recorder.PuppeteerScreenRecorder(page, {
        followNewTab: false,
        fps: 25,
        videoFrame: {
          width: 1024,
          height: 768
        },
        videoCrf: 18,
        videoCodec: "libx264",
        videoPreset: "ultrafast",
        videoBitrate: 1e3,
        autopad: {
          color: "black"
        },
        aspectRatio: "4:3"
      });
      const consoleLogs = [];
      await page.setRequestInterception(true);
      page.on(
        "console",
        (message) => {
          console.log(message);
          consoleLogs.push(
            `${message.type().substr(0, 3).toUpperCase()}			${message.text()}`
          );
        }
      ).on("pageerror", ({ message }) => consoleLogs.push(message)).on("response", async (response) => {
        consoleLogs.push(
          `Res			${response.status()} ${response.url()} ${JSON.stringify(
            response.request().headers()
          )}`
        );
      }).on(
        "requestfailed",
        (request) => consoleLogs.push(
          `REQ_FAIL	${request.failure().errorText} ${request.url()}`
        )
      ).on("request", (request) => {
        consoleLogs.push("REQUEST	", request);
        request.continue();
      });
      const pipeStream = new PassThrough();
      return page.setContent(subject.htmlBundle).then(async () => {
        await recorder.startStream(pipeStream);
        artificer(
          "./screenshot.png",
          await (await page).screenshot()
        );
        return {
          page,
          recorder,
          consoleLogs,
          pipeStream
        };
      });
    },
    andWhen: function({ page }, actioner) {
      return actioner()({ page });
    },
    butThen: async function({ page }) {
      return { page };
    },
    afterEach: async function({ page, recorder, consoleLogs, pipeStream }, ndx, artificer) {
      artificer("./screencap.mp4", pipeStream);
      await recorder.stop();
      pipeStream.end();
      artificer(`./screenshot.png`, await page.screenshot());
      artificer("./consoleLogs.txt", consoleLogs.join(`
`));
      return;
    },
    afterAll: (store, artificer) => {
      store.page.browser().close();
      return;
    }
  }
);

// src/ClassicalComponent.esbuild-puppeteer.test.ts
var ClassicalComponentEsbuildPuppeteerTesteranto = EsbuildPuppeteerTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return;
      }
    },
    Whens: {
      IClickTheButton: () => async ({ page }) => {
        await page.click("#theButton");
      }
    },
    Thens: {
      ThePropsIs: (expectation) => async ({ page }) => {
        assert.deepEqual(
          await page.$eval("#theProps", (el) => el.innerHTML),
          JSON.stringify(expectation)
        );
      },
      TheStatusIs: (expectation) => async ({ page }) => assert.deepEqual(
        await page.$eval("#theState", (el) => el.innerHTML),
        JSON.stringify(expectation)
      )
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  testSpecification,
  "src/ClassicalComponent.js"
);
export {
  ClassicalComponentEsbuildPuppeteerTesteranto
};
