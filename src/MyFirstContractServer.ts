// export default async () => {
//   console.log("hello MyFurstContractServer");
//   return true;
// };

import { ethers } from "ethers";
import Ganache from "ganache";
import { ITTestResourceConfiguration } from "../../testeranto/src/lib";
import Web3 from "web3";
import MyFirstContract from "../contracts/MyFirstContract.sol";

console.log("hello contract server");

class Server {
  // constructor(contract) {

  // }
  receiveTestResourceConfig(testResource: ITTestResourceConfiguration) {
    console.log(
      "hello contract server receiveTestResourceConfig",
      testResource
    );
    // const testResource = JSON.parse(testResourceString);
    const contract = MyFirstContract.contracts.find(
      (c) => c.contractName === "MyFirstContract"
    ) as { contractName: string; abi: any; bytecode: any };

    const options = {};
    const port = testResource.ports[0];

    // console.log("mark0", testResource);

    // https://github.com/trufflesuite/ganache#programmatic-use
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
      const contractNearSide = await new web3NearSide.eth.Contract(contract.abi)
        .deploy({ data: contract.bytecode.bytes })
        // .wait(1)
        .send({ from: accounts[0], gas: 7000000 });

      // await contractNearSide.waitForDeployment(1);

      // /////////////////////////////////////////////

      // const web3FarSideProvider = new ethers.providers.JsonRpcProvider(
      //   `http://localhost:${port}`
      // );
      // // web3FarSideProvider.
      // // create a test wallet from a ganache account
      // const web3FarSideSigner = new ethers.Wallet(
      //   providerFarSide.getInitialAccounts()[accounts[1]].secretKey,
      //   web3FarSideProvider
      // );

      // // create a contract that our test user can access
      // const contractFarSide = new ethers.Contract(
      //   contractNearSide.options.address,
      //   contract.abi,
      //   web3FarSideSigner
      // );

      // // console.log("server", server);
      // // server.
      // res({
      //   contractNearSide,
      //   contractFarSide,
      //   accounts,
      //   server,
      // });
    });
    server.on("close", (data) => {
      console.log("ganache closing");
    });
  }
}

export default new Promise((res, rej) => {
  res(Server);
});
