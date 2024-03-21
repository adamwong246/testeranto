

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

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}