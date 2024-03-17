import React, {
  CElement,
} from "react";
import ReactDom from "react-dom/client";

import { ITTestShape, ITestImplementation, ITestSpecification } from "testeranto/src/core";
import Testeranto from "testeranto/src/core-electron";

type Input = [string, (string) => string, any];
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;
type Selection = any;

type Prototype = typeof React.Component;
type Store = {
  htmlElement: HTMLElement,
  reactElement: CElement<any, any>,
};
type Subject = {
  htmlElement: HTMLElement
};

export default <ITestShape extends ITTestShape>(
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Prototype
) => {
  class TesterantoComponent extends testInput {
    done: (t: TesterantoComponent) => void;
    constructor(props) {
      super(props);
      this.done = props.done;
    }

    componentDidMount() {
      console.info("componentDidMount");
      super.componentDidMount && super.componentDidMount();
      return this.done(this);
    }
  }

  return Testeranto<
    ITestShape,
    Prototype,
    Subject,
    Store,
    Selection,
    ThenShape,
    WhenShape,
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async (
        prototype,
        artificer
      ): Promise<Subject> => {
        console.log("beforeAll");
        artificer("./before.txt", "hello artificer");
        return await new Promise((resolve, rej) => {
          document.addEventListener("DOMContentLoaded", function () {
            console.log("DOMContentLoaded");
            const elem = document.getElementById("root");
            if (elem) {
              console.log("elem", elem);
              resolve({ htmlElement: elem });
            }
          });
        })
      },
      beforeEach: async (
        { htmlElement },
        ndx,
        testRsource,
        artificer
      ): Promise<Store> => {
        console.log("beforeEach");

        return new Promise((resolve, rej) => {
          const reactElement = React.createElement(TesterantoComponent, {
            done: (reactElement) => {
              console.log("mark4", reactElement);
              resolve(
                {
                  htmlElement,
                  reactElement,
                }
              );
            }
          }, []);
          ReactDom.createRoot(htmlElement).render(reactElement);
        });
      },
      andWhen: function (s: Store, actioner): Promise<Selection> {
        return actioner()(s);
      },
      butThen: async function (s: Store): Promise<Selection> {
        return s;
      },
      afterEach: async function (
        store: Store,
        ndx,
        artificer
      ) {
        return {};
      },
      afterAll: (store: Store, artificer) => {
        // store.page.browser().close();
        return;
      },
    },
  )
};


// debugger
// const browser = await await puppeteer.launch({
//   headless: true,
//   executablePath:
//     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
// });

// return prototype;
// return {
//   // browser,
//   // htmlBundle: htmlTemplate(
//   //   esbuild.buildSync({
//   //     entryPoints: [bundlePath],
//   //     bundle: true,
//   //     minify: true,
//   //     format: "esm",
//   //     target: ["esnext"],
//   //     write: false,
//   //   }).outputFiles[0].text
//   // ),
// };


//
// return new Promise((res, rej) => {

// })
// reactElement.
// return { htmlElement, reactElement }


// const page = await subject.browser.newPage();

// const recorder = new PuppeteerScreenRecorder(page, {
//   followNewTab: false,
//   fps: 25,
//   videoFrame: {
//     width: 1024,
//     height: 768,
//   },
//   videoCrf: 18,
//   videoCodec: "libx264",
//   videoPreset: "ultrafast",
//   videoBitrate: 1000,
//   autopad: {
//     color: "black",
//   },
//   aspectRatio: "4:3",
// });

// const consoleLogs: string[] = [];
// await page.setRequestInterception(true);

// page
//   .on("console", (message) =>
//     consoleLogs.push(
//       `${message
//         .type()
//         .substr(0, 3)
//         .toUpperCase()}\t\t\t${message.text()}`
//     )
//   )
//   .on("pageerror", ({ message }) => consoleLogs.push(message))
//   .on("response", async (response) => {
//     consoleLogs.push(
//       `Res\t\t\t${response.status()} ${response.url()} ${JSON.stringify(
//         response.request().headers()
//       )}`
//     );
//     // response.continue();
//   })
//   .on("requestfailed", (request) =>
//     consoleLogs.push(
//       `REQ_FAIL\t${request.failure().errorText} ${request.url()}`
//     )
//   )
//   .on("request", (request) => {
//     consoleLogs.push("REQUEST\t", request);
//     request.continue();
//   });

// const pipeStream = new PassThrough();

// artificer("./screencap.mp4", pipeStream);

// return page.setContent(subject.htmlBundle).then(async () => {
//   // await recorder.startStream(pipeStream);
//   artificer(
//     "./beforeEachScreenshot.png",
//     await (await page).screenshot()
//   );
//   return {
//     // page,
//     // recorder: recorder,
//     // consoleLogs,
//     // pipeStream,
//   };
// });
// return;

// await recorder.stop();
// pipeStream.end();
// page.close();
// artificer("./afterEachScreenshot.png", await (await page).screenshot());
// artificer("./afterEachLogs.txt", consoleLogs.join(`\n`));