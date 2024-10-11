
import { assert } from "chai";

import { features } from "../features.test.mjs";
import { SolidityPrecompiledTesteranto } from "../myTests/solidity-precompiled.testeranto.test";
import { commonGivens } from './MyFirstContractGivens.test';
import { ITestImplementation, ITestSpecification } from "testeranto/src/Types";

type ISpec = {
  iinput: any,
  isubject: any,
  istore: any,
  iselection: any,

  when: (rectangle: any) => unknown,
  then: unknown,
  given: (x) => unknown,

  suites: {
    Default;
  };
  givens: {
    Default;
  };
  whens: {
    Increment: [number];
    Decrement: [number];
  };
  thens: {
    Get: [{ asTestUser: number, expectation: number }];
  };
  checks: {
    AnEmptyState;
  };
};

const specification: ITestSpecification<ISpec> = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing a very simple smart contract precompiled?",
      commonGivens(Given, When, Then, features),
      [
        // Check.AnEmptyState(
        //   "imperative style",
        //   [`aloha`],
        //   async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
        //     await TheEmailIsSetTo("foo");
        //     await TheEmailIs("foo");
        //     const reduxPayload = await TheEmailIsSetTo("foobar");
        //     await TheEmailIs("foobar");
        //     // assert.deepEqual(reduxPayload, {
        //     //   type: "login app/setEmail",
        //     //   payload: "foobar",
        //     // });
        //   }
        // ),
      ]
    ),
  ];
};

const implementation: ITestImplementation<ISpec, {
  givens: {
    [K in keyof ISpec["givens"]]: (
      ...Iw: ISpec["givens"][K]
    ) => void;
  }
  whens: {
    [K in keyof ISpec["whens"]]: (
      ...Iw: ISpec["whens"][K]
    ) => ISpec['when'];
  }
  checks: {
    [K in keyof ISpec["checks"]]: (
      ...Iw: ISpec["checks"][K]
    ) => void;
  }
}> = {
  suites: {
    Default: "Testing a very simple smart contract"
  },
  givens: {
    Default: () => {
      return 'MyFirstContract.sol';
    }
  },
  whens: {
    Increment: (asTestUser) => ({ contract, accounts }) => {
      return contract.methods.inc().send({ from: accounts[asTestUser] })
        .on('receipt', function (x) {
          return (x);
        })
    },
    Decrement: (asTestUser) => ({ contract, accounts }) => {
      return contract.methods.dec().send({ from: accounts[asTestUser] })
        .on('receipt', function (x) {
          return (x)
        })
    },
  },
  thens: {
    Get: ({ asTestUser, expectation }) => async ({ contract, accounts }) =>
      assert.equal((expectation), parseInt((await contract.methods.get().call())))
  },
  checks: {
    AnEmptyState: () => 'MyFirstContract.sol',
  },
};

export const MyFirstContractPrecompiledTesteranto = SolidityPrecompiledTesteranto<
  ISpec
>(
  implementation,
  specification,

  ['MyFirstContract', async (web3) => {
    // const accounts = await web3.eth.getAccounts();
    return []
  }]
);
