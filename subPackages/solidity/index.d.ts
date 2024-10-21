declare module '*.sol' {
  import { AbiItem } from "web3-utils";

  const content: {
    contracts: {
      contractName: string,
      abi: AbiItem | AbiItem[]
    }[]
  };
  export default content;
}

