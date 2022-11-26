import Rectangle from "./Rectangle/Rectangle.test";
import LoginSelector from "./Redux+Reselect+React/LoginSelector.test";
import LoginStore from "./Redux+Reselect+React/LoginStore.test";
import LoginPage from "./Redux+Reselect+React/LoginPage.test";
import HttpServerTests from "./httpServer/server.test";

export {};

Promise.all([
  // LoginStore(),
  // LoginSelector(),
  // Rectangle(),
  // LoginPage(),
  HttpServerTests(),
]).then(() => {
  console.log("all done");
  process.exit(0);
});
