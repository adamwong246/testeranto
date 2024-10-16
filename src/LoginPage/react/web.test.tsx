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
    afterAll: (store, artificer, utils: any) => {
      const webContents = utils.getCurrentWebContents();

      webContents.capturePage({
        x: 0,
        y: 0,
        width: 100,
        height: 200
      }, (img) => {
        artificer("hello.png", img.toPng());
      }).then((x) => {
        console.log("done", x);
      });
      artificer("utils", "hellow orld");
      // console.log("HELLO WORLD");
      // console.log(store);
      // console.log(artificer);
      // console.log(utils);
    }
  }
);
