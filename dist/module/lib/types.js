// for internal types only
export class TBrowser {
    constructor(browser) {
        this.browser = browser;
    }
    pages() {
        return new Promise(async (res, rej) => {
            res((await this.browser.pages()).map((p) => {
                // const handler = {
                //   apply: function (target, thisArg, argumentsList) {
                //     console.log('screenshot was called with ' + JSON.stringify(argumentsList));
                //     const x: ScreenshotOptions = argumentsList[0]
                //     x.path = "./dist/" + x.path;
                //     console.log('x.path' + x.path, target, thisArg);
                //     return target(...argumentsList);
                //   }
                // };
                // p.screenshot = new Proxy(p.screenshot, handler);
                return p;
            }));
        });
    }
}
// export type ITestShaper<
//   T extends IBaseTest,
//   modifier
// > = {
//   given;
//   when;
//   then;
//   suites;
//   givens;
//   whens;
//   thens;
//   checks;
// };
// export class TPage extends Page {
//   // screenshot(options?: puppeteer.ScreenshotOptions) {
//   //   return super.screenshot({
//   //     ...options,
//   //     path: "dist/" + (options ? options : { path: "" }).path,
//   //   });
//   // }
// }
// type If = {
//   (modulePath: string | URL, options?: childProcess.ForkOptions): childProcess.ChildProcess;
//   (modulePath: string | URL, args?: readonly string[], options?: childProcess.ForkOptions): childProcess.ChildProcess
// };
// const f: If = childProcess.fork;
