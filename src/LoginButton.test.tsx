import { assert } from "chai";

import { ITestImplementation } from "./Types";

import { ITestSpecification } from "./Types.js";
import Testeranto from "./SubPackages/react-dom/jsx/web";
import LoginButton from "./LoginButton";
import { JSHandle } from "puppeteer-core";

const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
function simulateMouseClick(element) {
  mouseClickEvents.forEach(mouseEventType =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
      })
    )
  );
}


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
    Clicked: () => (x) => {
      console.log("click 10");
      var testEvent = new PointerEvent("click") as any;
      testEvent.nativeEvent = { detail: 1 }
      x.reactElement.children[0].onClick(testEvent);
      // console.log(x.reactElement.children[0].click());
      // simulateMouseClick(x.htmlElement);
      // reactElem.htmlElement.click()
      // debugger
      // console.log("helllo!", reactElem.click());
      // reactElem.props.store.dispatch(actions.signIn());
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
        // test0: Given.default(
        //   ["67ae06bac3c5fa5a98a08e32"],
        //   [],
        //   [Then.ItSaysLogIn()]
        // ),
        test1: Given.default(
          ["67ae06bac3c5fa5a98a08e32"],
          [When.Clicked()],
          [Then.ItSaysSignOut()]
        ),
        // test2: Given.default(
        //   ["67ae06bac3c5fa5a98a08e32"],
        //   [When.Clicked(), When.Clicked()],
        //   [Then.ItSaysLogIn()]
        // ),
        // test3: Given.default(
        //   ["67ae06bac3c5fa5a98a08e32"],
        //   [When.Clicked(), When.Clicked(), When.Clicked()],
        //   [Then.ItSaysSignOut()]
        // ),
        // test1: Given.default(
        //   [`67ae06bac3c5fa5a98a08e32`],
        //   [
        //     When.TheEmailIsSetTo("adam@email.com"),
        //     When.ThePasswordIsSetTo("secret"),
        //   ],
        //   [
        //     Then.TheEmailIsNot("wade@rpc"),
        //     Then.TheEmailIs("adam@email.com"),
        //     Then.ThePasswordIs("secret"),
        //     Then.ThePasswordIsNot("idk"),
        //   ]
        // ),
        // test2: Given.default(
        //   [`67ae06bac3c5fa5a98a08e32`],
        //   [When.TheEmailIsSetTo("adam@email.com")],
        //   [Then.ThereIsNotAnEmailError()]
        // ),
        // test3: Given.default(
        //   [`67ae06bac3c5fa5a98a08e32`],
        //   [When.TheEmailIsSetTo("bob"), When.TheLoginIsSubmitted()],
        //   [Then.ThereIsAnEmailError()]
        // ),
        // test4: Given.default(
        //   [`67ae06bac3c5fa5a98a08e32`],
        //   [
        //     When.TheEmailIsSetTo("adam@mail.com"),
        //     When.ThePasswordIsSetTo("foso"),
        //   ],
        //   [Then.ThereIsNotAnEmailError()]
        // ),
        // test5: Given.default(
        //   [`67ae44eceef213d8f11c40bb`],
        //   [
        //     When.TheEmailIsSetTo("adam@mail.com"),
        //     When.ThePasswordIsSetTo("foso"),
        //   ],
        //   [Then.ThereIsNotAnEmailError()]
        // ),
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

