import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  MyFirstContractTestInput,
  commonGivens,
  features,
  require_lib15 as require_lib
} from "../chunk-HEF7ZV7R.mjs";
import {
  Node_default
} from "../chunk-PYUZ2MPT.mjs";
import {
  assert
} from "../chunk-MSVTAS6Q.mjs";
import "../chunk-K5DK65GD.mjs";
import "../chunk-FLSG3ZVV.mjs";
import "../chunk-CTKBT5JH.mjs";
import "../chunk-RBWPBMY4.mjs";
import "../chunk-PJC2V65J.mjs";
import "../chunk-VDOS7AVZ.mjs";
import {
  __toESM,
  init_cjs_shim
} from "../chunk-THMF2HPO.mjs";

// src/MyFirstContract.solidity-react.testeranto.ts
init_cjs_shim();

// src/MyFirstContract.solidity-react.interface.test.ts
init_cjs_shim();
var import_web3 = __toESM(require_lib(), 1);
import Ganache from "ganache";
var tInterface = {
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
      server.listen(port, async (err) => {
        console.log(`ganache listening on port ${port}...`);
        if (err)
          throw err;
        const providerFarSide = server.provider;
        const accounts = await providerFarSide.request({
          method: "eth_accounts",
          params: []
        });
        const web3NearSide = new import_web3.default(providerFarSide);
        const contractNearSide = await new web3NearSide.eth.Contract(
          contract.abi
        ).deploy({ data: contract.bytecode.bytes }).send({ from: accounts[0], gas: 7e6 });
        const page = await pm.browser.newPage();
        await page.setViewport({ width: 0, height: 0 });
        page.on("console", (msg) => {
          console.log("web myfirstcontract > ", msg.args(), msg.text());
        });
        const encoded = Object.entries({
          port,
          address: contractNearSide.options.address,
          secretKey: providerFarSide.getInitialAccounts()[accounts[1]].secretKey
        }).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
        await page.goto(
          `file://${process.cwd()}/docs/web/src/MyFirstContractUI.html?${encoded}`
        );
        res({
          contractNearSide,
          accounts,
          server,
          step: 0
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
      return strippedUrl === "file:///Users/adam/Code/kokomoBay/docs/web/src/MyFirstContractUI.html";
    })[0];
    page.screenshot({
      path: "afterEach.jpg"
    });
    await store.server.close();
    return store;
  },
  andWhen: async (props, callback, tr, pm) => {
    props.step = props.step + 1;
    console.log("AND WHEN", props.step);
    let semaphore = -1;
    const page = (await pm.browser.pages()).filter((x2) => {
      const parsedUrl = new URL(x2.url());
      parsedUrl.search = "";
      const strippedUrl = parsedUrl.toString();
      return strippedUrl === "file:///Users/adam/Code/kokomoBay/docs/web/src/MyFirstContractUI.html";
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
      }, 1e3);
    });
    const x = callback({ ...props, page });
    await page.screenshot({
      path: "andWhen.jpg"
    });
    console.log("halt");
    await p;
    console.log("continuing...");
    await page.removeExposedFunction("readyForNext");
    return {
      ...x,
      step: props.step
    };
  },
  butThen: async (store, thenCB, testResource, pm) => {
    console.log("BUT THEN");
    let semaphore = false;
    const page = (await pm.browser.pages()).filter((x2) => {
      const parsedUrl = new URL(x2.url());
      parsedUrl.search = "";
      const strippedUrl = parsedUrl.toString();
      return strippedUrl === "file:///Users/adam/Code/kokomoBay/docs/web/src/MyFirstContractUI.html";
    })[0];
    const x = thenCB({ ...store, page });
    await page.screenshot({
      path: "butThen.jpg"
    });
    return x;
  },
  afterAll: async (s, a, pm) => {
    console.log("AFTER ALL");
    const page = (await pm.browser.pages()).filter((x) => {
      const parsedUrl = new URL(x.url());
      parsedUrl.search = "";
      const strippedUrl = parsedUrl.toString();
      return strippedUrl === "file:///Users/adam/Code/kokomoBay/docs/web/src/MyFirstContractUI.html";
    })[0];
    page.close();
  }
};
var MyFirstContract_solidity_react_interface_test_default = tInterface;

// src/MyFirstContract.solidity-react.implementation.test.ts
init_cjs_shim();
var testImplementation = {
  suites: {
    Default: "Testing a very simple smart contract"
  },
  givens: {
    Default: () => {
      return "MyFirstContract.sol";
    }
  },
  whens: {
    Increment: (asTestUser) => async (props) => {
      const element = await props.page.$("#increment");
      element.click();
    },
    Decrement: (asTestUser) => async (props) => {
      const element = await props.page.$("#decrement");
      element.click();
    }
  },
  thens: {
    Get: ({ asTestUser, expectation }) => async (props) => {
      const element = await props.page.$("#counter");
      const element_property = await element.getProperty("innerHTML");
      const inner_html = await element_property.jsonValue();
      assert.deepEqual(inner_html, expectation.toString());
    }
  },
  checks: {
    AnEmptyState: () => "MyFirstContract.sol"
  }
};
var MyFirstContract_solidity_react_implementation_test_default = testImplementation;

// src/MyFirstContract.solidity-react.testeranto.ts
var MyFirstContract_solidity_react_testeranto_default = Node_default(
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
      )
    ];
  },
  MyFirstContract_solidity_react_implementation_test_default,
  MyFirstContract_solidity_react_interface_test_default
);
export {
  MyFirstContract_solidity_react_testeranto_default as default
};
