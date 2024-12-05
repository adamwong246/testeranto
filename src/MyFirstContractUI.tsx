import ReactDom from "react-dom/client";
import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";

import "@ethersproject/shims"

import MyFirstContract from "../contracts/MyFirstContract.sol";

export const noError = 'no_error';

export type ILoginPageError = 'invalidEmail' | `credentialFail` | typeof noError;

export type ILoginPageSelection = {
  password: string;
  email: string;
  error: ILoginPageError;
  disableSubmit: boolean;
};

const compiled = MyFirstContract.contracts.find(
  (c) => c.contractName === "MyFirstContract"
) as { contractName: string; abi: any; bytecode: any };

export function MyFirstContractUI(props: {
  port: number,
  secretKey: string,
  address: string,
}): React.JSX.Element {

  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [counter, setCounter] = useState<number | null>(null);
  const [nonce, setNonce] = useState<number>(-1);

  useEffect(() => {
    const initializeProvider = async () => {
      const web3FarSideProvider = new ethers.providers.JsonRpcProvider({
        url: "http://localhost:3001",
        allowInsecureAuthentication: true,
        skipFetchSetup: true,
        errorPassThrough: true,
      });
      setProvider(web3FarSideProvider);
    };

    initializeProvider();
  }, []);

  useEffect(() => {
    const setupProvider = async () => {
      if (provider) {
        const web3FarSideSigner = new ethers.Wallet(
          props.secretKey,
          provider
        );

        const contractFarSide = new ethers.Contract(
          props.address,
          compiled.abi,
          web3FarSideSigner
        );
        setContract(contractFarSide);
      }
    };

    setupProvider();
  }, [provider]);


  useEffect(() => {
    const listenToContract = async () => {
      if (provider && contract) {
        // Listen for new blocks, and retrieve all transactions in each block
        provider.on("block", async (blockNumber) => {
          const block = await provider.getBlock(blockNumber);
          console.log("New block:", block);
          setNonce(blockNumber)
          const c = (await contract.get({ gasLimit: 150000 })).toString();
          setCounter(c)
          window["readyForNext"] && window["readyForNext"](c);
        });
      }
    };

    listenToContract();
  }, [provider, contract]);

  if (!contract || !provider) {
    return <p>loading...</p>
  }

  return (<div>
    <h2>My First Contract</h2>
    <h3 id="nonce">{nonce}</h3>

    <button id="increment" onClick={async () => {
      // setLoading(true)
      await contract.inc({ gasLimit: 150000 })
      // setCounter((await contract.get({ gasLimit: 150000 })).toString())
      // setLoading(false)
      // window['readyForNext'] && window['readyForNext']()
    }} >Increment</button>

    <button id="decrement" onClick={async () => {
      // setLoading(true)
      await contract.dec({ gasLimit: 150000 })
      // setCounter((await contract.get({ gasLimit: 150000 })).toString())
      // setLoading(false)
      // window['readyForNext'] && window['readyForNext']()
    }} >Decrement</button>

    <pre id="counter">{counter}</pre>

  </div>);
}

export default MyFirstContractUI

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const props = {
    port: Math.trunc(urlParams.get('port') as any),
    secretKey: urlParams.get("secretKey") as string,
    address: urlParams.get("address") as string,
  };

  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(MyFirstContractUI,
      props
    ));
  }
});
