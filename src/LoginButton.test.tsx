import { assert } from "chai";

import { ITestImplementation } from "./Types";

import { ITestSpecification } from "./Types.js";
import Testeranto from "./SubPackages/react-dom/jsx/web";
import LoginButton from "./LoginButton";
import { Page } from "puppeteer-core/lib/esm/puppeteer/api/Page";

type IImpl = ITestImplementation<
  ILoginPageSpecs, object
>

const implementations: IImpl = {
  suites: {
    Default: "a default suite",
  },
  givens: {
    default: () => (i) => {
      console.log("default");
      return i;
    },
  },

  whens: {
    Clicked: () => async (x, utils) => {
      const pages = await utils.browser.pages();

      const page = pages.find((p) => {
        return p.url() === "file:///Users/adam/Code/testeranto/docs/web/src/LoginButton.test.html"
      }) as Page;

      await page.evaluate(() => {
        document.getElementById("signin")?.click();

      });

      return

    },

  },

  thens: {
    ItSaysLogIn: () => (reactElem) => {
      return assert.equal(reactElem.htmlElement.innerText, "Log in");
    },
    ItSaysSignOut: () => (reactElem) => {
      return assert.equal(reactElem.htmlElement.innerText, "Sign out");
    }
  },

  checks: {
    default: () => (i) => {
      return i;
    },
  },
}

export type ILoginPageSpecs = {
  iinput: any;
  isubject: any;
  istore: any;
  iselection: any;

  when: void;
  then: unknown;
  given: (x) => unknown;

  suites: {
    Default: [string];
  };
  givens: {
    default: [];
  };
  whens: {
    Clicked: [];
  };
  thens: {
    ItSaysLogIn: [];
    ItSaysSignOut: [];
  };
  checks: {
    default;
  };
};

export const LoginPageSpecs: ITestSpecification<ILoginPageSpecs> = (
  Suite,
  Given,
  When,
  Then,
  Check
) => {
  return [
    Suite.Default(
      "Testing the LoginButton",
      {
        test0: Given.default(
          ["0"],
          [],
          [Then.ItSaysLogIn()]
        ),
        test1: Given.default(
          ["0"],
          [When.Clicked()],
          [Then.ItSaysSignOut()]
        ),
        test2: Given.default(
          ["0"],
          [When.Clicked(), When.Clicked()],
          [Then.ItSaysLogIn()]
        ),
        test3: Given.default(
          ["1"],
          [When.Clicked(), When.Clicked(), When.Clicked()],
          [Then.ItSaysSignOut()]
        ),
      },
      []
    ),
  ];
};


export default Testeranto(
  implementations,
  LoginPageSpecs,
  LoginButton,
  // {

  //   // beforeEach: async (proto, init, artificer, tr, x, pm) => {
  //   //   // debugger
  //   //   pm.writeFileSync("beforeEachLog", "bar");
  //   //   return proto;
  //   // },
  //   // afterAll: (store, artificer, utils) => {
  //   //   // debugger
  //   //   utils.writeFileSync("afterAllLog", "bar");
  //   //   // const webContents = utils.browser.webContents;
  //   //   // console.log("domoarigato", pm.browser);
  //   //   // page.screenshot({
  //   //   //   path: "afterAllLog.jpg",
  //   //   // });
  //   //   // utils.browser.webContents.capturePage({
  //   //   //   x: 0,
  //   //   //   y: 0,
  //   //   //   width: 100,
  //   //   //   height: 200
  //   //   // }, (img: { toPng: () => any; }) => {
  //   //   //   console.log("testing123")
  //   //   //   artificer("hello.png", img.toPng());
  //   //   // }).then((x) => {
  //   //   //   console.log("done", x);
  //   //   // });
  //   //   // artificer("utils", `utils.browser.webContents: ${utils.browser.webContents}`);
  //   //   // console.log("HELLO WORLD");
  //   //   // console.log(store);
  //   //   // console.log(artificer);
  //   //   // console.log(utils);
  //   //   return store;
  //   // }
  // }
);

