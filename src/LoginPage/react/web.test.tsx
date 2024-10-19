import test from "testeranto/src/SubPackages/react/jsx/web";

import LoginPage from "../index.js";
import {
  LoginPageSpecs
} from "../test.js";
import implementations from "./test.js";

export default test(
  implementations,
  LoginPageSpecs,
  LoginPage,
  {
    afterAll: (store, artificer, utils) => {
      // const webContents = utils.browser.webContents;
      console.log("domoarigato")

      utils.browser.webContents.capturePage({
        x: 0,
        y: 0,
        width: 100,
        height: 200
      }, (img: { toPng: () => any; }) => {
        console.log("testing123")
        artificer("hello.png", img.toPng());
      }).then((x) => {
        console.log("done", x);
      });
      // artificer("utils", `utils.browser.webContents: ${utils.browser.webContents}`);
      // console.log("HELLO WORLD");
      // console.log(store);
      // console.log(artificer);
      // console.log(utils);
    }
  }
);
