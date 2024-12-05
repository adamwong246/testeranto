import { assert } from "chai";
import fs from "fs";
import { features } from "../features.test.mjs";
import Web3 from "web3";
import Testeranto from "testeranto/src/Node";

import {
  IMyFirstContractTest,
  commonGivens,
  MyFirstContractTestInput,
} from "./MyFirstContract.test";
import {
  IPartialNodeInterface,
  ITestImplementation,
} from "testeranto/src/Types";
import { ethers } from "ethers";
import Ganache from "ganache";
import { IInput } from "../subPackages/solidity/Contract.testeranto.test";
import { testInterface } from "../../testeranto/src/SubPackages/react/jsx";
import { ITTestResourceConfiguration } from "../../testeranto/src/lib";
import { PM } from "../../testeranto/src/PM";

const testImplementation: ITestImplementation<
  IMyFirstContractTest<IMyFirstContractTest<any>>
> = {
  suites: {
    Default: "Testing a very simple smart contract",
  },
  givens: {
    Default: () => {
      return "MyFirstContract.sol";
    },
  },
  whens: {
    Increment: (asTestUser) => async (props) => {
      const element = await props.page.$("#increment");
      element.click();
    },
    Decrement: (asTestUser) => async (props) => {
      const element = await props.page.$("#decrement");
      element.click();
    },
  },
  thens: {
    Get:
      ({ asTestUser, expectation }) =>
      async (props) => {
        const element = await props.page.$("#counter");
        const element_property = await element.getProperty("innerHTML");
        const inner_html = await element_property.jsonValue();

        assert.deepEqual(inner_html, expectation.toString());
      },
  },
  checks: {
    AnEmptyState: () => "MyFirstContract.sol",
  },
};

const tInterface: IPartialNodeInterface<any> = {
  // beforeAll: async () =>
  //   (await solCompile(contractName)).contracts.find(
  //     (c) => c.contractName === contractName
  //   ),

  beforeEach: (contract, i, artificer, testResource, iv, pm) => {
    console.log("BEFORE EACH");
    return new Promise((res) => {
      const options = {};
      const port = testResource.ports[0];

      const server = Ganache.server(options);

      // start the ganache chain
      server.listen(port, async (err) => {
        console.log(`ganache listening on port ${port}...`);
        if (err) throw err;

        const providerFarSide = server.provider;
        const accounts = await providerFarSide.request({
          method: "eth_accounts",
          params: [],
        });

        /* @ts-ignore:next-line */
        const web3NearSide = new Web3(providerFarSide);

        // deploy the contract under accounts[0]
        const contractNearSide = await new web3NearSide.eth.Contract(
          contract.abi
        )
          .deploy({ data: contract.bytecode.bytes })
          .send({ from: accounts[0], gas: 7000000 });

        /////////////////////////////////////////////

        const page = await pm.browser.newPage();

        await page.setViewport({ width: 0, height: 0 });
        page.on("console", (msg) => {
          console.log("web myfirstcontract > ", msg.args(), msg.text());
          // for (let i = 0; i < msg._args.length; ++i)
          //   console.log(`${i}: ${msg._args[i]}`);
        });

        const encoded = Object.entries({
          port,
          address: contractNearSide.options.address,
          secretKey:
            providerFarSide.getInitialAccounts()[accounts[1]].secretKey,
        })
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join("&");

        await page.goto(
          `file://${process.cwd()}/docs/web/src/MyFirstContractUI.html?${encoded}`
        );

        res({
          contractNearSide,
          accounts,
          server,
          step: 0,
          // page,
        });
      });
    });
  },

  afterEach: async (store, k, a, pm) => {
    console.log("AFTER EACH");
    let semaphore = false;
    const page = (await pm.browser.pages()).filter((x) => {
      const parsedUrl = new URL(x.url());
      parsedUrl.search = "";
      const strippedUrl = parsedUrl.toString();

      return (
        strippedUrl ===
        "file:///Users/adam/Code/kokomoBay/docs/web/src/MyFirstContractUI.html"
      );
      // return true;
    })[0];

    // await page.exposeFunction("readyForNext", (text) => {
    //   console.log("readyForNext afterEach", p);
    //   semaphore = true;
    //   process.exit(-1);
    // });

    // const p = new Promise((res, rej) => {
    //   const interval = setInterval(() => {
    //     console.log("check afterEach", semaphore);
    //     if (semaphore === true) {
    //       clearInterval(interval);
    //       res(true);
    //     } else {
    //     }
    //   }, 1000);
    // });
    // const x = thenCB(store);
    page.screenshot({
      path: "afterEach.jpg",
    });
    await store.server.close();
    // console.log("halt");
    // await p;
    // console.log("continuing...");
    // await page.removeExposedFunction("readyForNext");

    // await page.screenshot({
    //   path: "butThen.jpg",
    // });
    // return thenCB(store);
    return store;

    // page.screenshot({
    //   path: "contract.jpg",
    // });

    // // await x.server.close();
    // return x;
  },

  andWhen: async (props, callback: any, tr, pm) => {
    props.step = props.step + 1;

    console.log("AND WHEN", props.step);
    let semaphore = -1;

    const page = (await pm.browser.pages()).filter((x) => {
      const parsedUrl = new URL(x.url());
      parsedUrl.search = "";
      const strippedUrl = parsedUrl.toString();

      return (
        strippedUrl ===
        "file:///Users/adam/Code/kokomoBay/docs/web/src/MyFirstContractUI.html"
      );
      // return true;
    })[0];

    await page.exposeFunction("readyForNext", (blockNumber) => {
      console.log("readyForNext", blockNumber);
      semaphore = Math.trunc(blockNumber);
    });

    const p = new Promise((res, rej) => {
      const interval = setInterval(() => {
        console.log("check andWhen", semaphore, props.step);
        if (semaphore === props.step) {
          clearInterval(interval);
          res(true);
        } else {
        }
      }, 1000);
    });

    const x = callback({ ...props, page });

    await page.screenshot({
      path: "andWhen.jpg",
    });
    console.log("halt");
    await p;
    console.log("continuing...");
    await page.removeExposedFunction("readyForNext");

    return {
      ...x,
      step: props.step,
    };
  },
  butThen: async (
    store,
    thenCB,
    testResource: ITTestResourceConfiguration,
    pm: PM
  ) => {
    console.log("BUT THEN");
    let semaphore = false;

    const page = (await pm.browser.pages()).filter((x) => {
      const parsedUrl = new URL(x.url());
      parsedUrl.search = "";
      const strippedUrl = parsedUrl.toString();

      return (
        strippedUrl ===
        "file:///Users/adam/Code/kokomoBay/docs/web/src/MyFirstContractUI.html"
      );
      // return true;
    })[0];

    // await page.exposeFunction("readyForNext", (text) => {
    //   console.log("readyForNext", p);
    //   semaphore = true;
    // });

    // const p = new Promise((res, rej) => {
    //   const interval = setInterval(() => {
    //     console.log("check butThen", semaphore);
    //     if (semaphore === true) {
    //       clearInterval(interval);
    //       res(true);
    //     } else {
    //     }
    //   }, 1);
    // });
    const x = thenCB({ ...store, page });
    await page.screenshot({
      path: "butThen.jpg",
    });
    // console.log("halt");
    // await p;
    // console.log("continuing...");
    // await page.removeExposedFunction("readyForNext");

    // await page.screenshot({
    //   path: "butThen.jpg",
    // });
    // return thenCB(store);
    return x;
  },

  afterAll: async (s, a, pm) => {
    console.log("AFTER ALL");
    const page = (await pm.browser.pages()).filter((x) => {
      const parsedUrl = new URL(x.url());
      parsedUrl.search = "";
      const strippedUrl = parsedUrl.toString();

      return (
        strippedUrl ===
        "file:///Users/adam/Code/kokomoBay/docs/web/src/MyFirstContractUI.html"
      );
      // return true;
    })[0];
    page.close();
    // console.log("serve!r", server);
  },
};

export default Testeranto<IMyFirstContractTest<IMyFirstContractTest<IInput>>>(
  MyFirstContractTestInput,

  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing a very simple smart contract over RPC",
        commonGivens(Given, When, Then, features),
        [
          // Check.AnEmptyState(
          //   "imperative style",
          //   [`aloha`],
          //   async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
          //     await TheEmailIsSetTo("foo");
          //     await TheEmailIs("foo");
          //     const reduxPayload = await TheEmailIsSetTo("foobar");
          //     await TheEmailIs("foobar");
          //     // assert.deepEqual(reduxPayload, {
          //     //   type: "login app/setEmail",
          //     //   payload: "foobar",
          //     // });
          //   }
          // ),
        ]
      ),
    ];
  },

  testImplementation,
  tInterface
);
