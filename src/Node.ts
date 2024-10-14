// const remote = require('@electron/remote')
import http from "http";
import Testeranto from "./lib/core.js";
import {
  DefaultTestInterface,
  defaultTestResourceRequirement,
  ITestJob,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./lib/index.js";
import { NodeWriter } from "./NodeWriter.js";
import {
  IBaseTest,
  INodeTestInterface,
  ITestImplementation,
  ITestInterface,
  ITestSpecification
} from "./Types.js";
import puppeteer from "puppeteer-core";

const readJson = async (port: string): Promise<any> => new Promise((resolve, reject) => {
  let json = "";
  const request = http.request(
    {
      host: "127.0.0.1",
      path: "/json/version",
      port,


    },
    (response) => {
      console.log("mark5");
      response.on("error", reject);
      response.on("data", (chunk: Buffer) => {
        json += chunk.toString();
      });
      response.on("end", () => {
        console.log("end");
        resolve(JSON.parse(json))
        // resolve(json)
      });
    }
  );
  // console.log("mark2", request);

  request.on("error", reject);

  request.end();
  // console.log("mark4");
});


const browser = await readJson("2999").then(async (json) => {
  // console.log("mark", json);

  // const browser = await puppeteer.launch({ headless: true });
  const b = await puppeteer.connect({
    browserWSEndpoint: json.webSocketDebuggerUrl,
    defaultViewport: null,
  });
  console.log("connected!", b.isConnected());

  // try {
  //   // hack
  //   await b.pages()
  //   // console.log("pages?", (await b.pages()));
  // } catch {
  //   console.log("pages");
  // }

  // const page = ((await b.pages()))[0];//.filter((x) => x.url() === 'file:///Users/adam/Code/kokomoBay/dist/web/src/ClassicalComponent/test.html'))[0]
  // console.log("page", page);
  // const p = page.screenshot({
  //   path: 'aa.jpg'
  // })
  // try {
  //   await p
  //   // hack
  //   // await b.pages()
  //   // console.log("pages?", (await b.pages()));
  // } catch {
  //   console.log("pages");
  // }


  return b


  // // browser.newPage().then((p) => {
  // //   console.log("p", p);
  // // }).finally(() => {
  // //   console.log("idk");
  // // })

  // // const page = (await browser.pages())[0];

  // console.log("page", page.url());

  // console.log("p", p);
  // await p
  // console.log("pp", pp);

})


class NodeTesteranto<
  TestShape extends IBaseTest
> extends Testeranto<
  TestShape
> {
  constructor(
    input: TestShape["iinput"],
    testSpecification: ITestSpecification<TestShape>,
    testImplementation: ITestImplementation<TestShape, object>,
    testResourceRequirement: ITTestResourceRequest,
    testInterface: Partial<ITestInterface<TestShape>>,
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      NodeWriter,
      testInterface,
      browser
    );

    const t: ITestJob = this.testJobs[0];
    const testResourceArg = process.argv[2] || `{}`;

    try {
      const partialTestResource = JSON.parse(
        testResourceArg
      ) as ITTestResourceConfiguration;

      this.receiveTestResourceConfig(t, partialTestResource);

    } catch (e) {
      console.error(e);
      // process.exit(-1);
    }
  }

  async receiveTestResourceConfig(t: ITestJob, partialTestResource: ITTestResourceConfiguration) {

    // var window = remote.getCurrentWindow();

    const {
      failed,
      artifacts,
      logPromise
    } = await t.receiveTestResourceConfig(partialTestResource);

    Promise.all([...artifacts, logPromise]).then(async () => {
      // process.exit(await failed ? 1 : 0);
    })
  }

};

export default async <ITestShape extends IBaseTest>(
  input: ITestShape['iinput'],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape, object>,
  testInterface: Partial<INodeTestInterface<ITestShape>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
): Promise<Testeranto<ITestShape>> => {
  return new NodeTesteranto<ITestShape>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface,
  )

};


// export default async <
//   ITestShape extends IBaseTest,
// >(
//   input: ITestShape['iinput'],
//   testSpecification: ITestSpecification<ITestShape>,
//   testImplementation: ITestImplementation<ITestShape, object>,
//   testInterface: Partial<ITestInterface<ITestShape>>,
//   testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
// ) => {
//   new NodeTesteranto<ITestShape>(
//     input,
//     testSpecification,
//     testImplementation,
//     testResourceRequirement,
//     testInterface,
//   )

// };
