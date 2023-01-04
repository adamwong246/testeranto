import { MyFirstContractTesteranto } from "./MyFirstContract.test";

(async () => {
  await new MyFirstContractTesteranto()[0].runner({ port: 3001 })
})()

