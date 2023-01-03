import fs from "fs";
import path from "path";

import Web3 from 'web3';
import Web3Contract, { Contract } from 'web3-eth-contract';

import { SpawnSyncReturns, ChildProcessWithoutNullStreams, spawn, spawnSync } from 'node:child_process';

import { TesterantoFactory } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type ITestUsers = { address: string, pKey: string }[];

type Selection = {
  truffleDevelopThread: ChildProcessWithoutNullStreams,
  web3: Web3,
  contract: Contract,
  users: ITestUsers
};
type TestResource = never;
type WhenShape = any;
type ThenShape = any;
type Input = any;

const contractAddress = "contract address";

export const SolidityTesteranto = <
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    string,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input,
  contractName: string,
  entryPath: string
) =>
  TesterantoFactory<
    ITestShape,
    string,
    SpawnSyncReturns<Buffer>,
    Selection,
    Selection,
    WhenShape,
    ThenShape,
    TestResource,
    string
  // { contract: Contract, users: Record<number, string> }
  >(
    testInput,
    testSpecifications,
    testImplementations,
    "port",
    {

      beforeAll: async (x) => spawnSync('truffle', ['compile']),

      beforeEach: (subject, initialValues: any, ethereumNetworkPort: string) => {
        // console.log("beforeEach", subject)
        const blockchainAddress = `ws://localhost:${ethereumNetworkPort}`;
        // Web3Contract.Contr act.setProvider(blockchainAddress);

        return new Promise((res, rej) => {
          const truffleDevelopThread = spawn('truffle', ['console']);

          let logs: string[] = [];

          truffleDevelopThread.stdout.on('data', (data) => {
            const str = data.toString();
            console.log("TDT >", str);
            logs.concat(str.split('\n'));

            if (str.includes("truffle(develop)>")) {

              let stage: "start" | "addresses" | "keys" | "mnemonic" | "end" = "start";
              const users: ITestUsers = [];
              let mnemonic: string[] = [];

              for (const line of logs) {
                // console.log("mark0 --->", line, "<---")

                if (line.includes("Accounts:")) {
                  stage = "addresses";
                  continue;
                } else if (line.includes("Private Keys:")) {
                  stage = "keys";
                  continue;
                } else if (line.includes("Mnemonic:")) {
                  stage = "mnemonic";
                  continue;
                }

                if (stage === "addresses") {
                  const [dirtyIndex, address] = line.split(" ");
                  const ndx = dirtyIndex[1];
                  users[ndx].address = address;
                } else if (stage === "keys") {
                  const [dirtyIndex, pKey] = line.split(" ");
                  const ndx = dirtyIndex[1];
                  users[ndx].pKey = pKey;
                } else if (stage === "mnemonic") {
                  mnemonic = line.split("Mnemonic:")[1].trim().split(" ")
                }
              }

              const tmt = spawn('truffle', ['migrate', '--network', 'develop', '--reset'])
                .stdout.on('data', (dat) => {
                  const data = dat.toString();
                  console.log("TMT >", data.toString());
                  if (data.includes(contractAddress)) {
                    const line = data.split('\n')
                      .find((s) => s.includes(contractAddress));
                    if (!line) {
                      console.error('parse error')
                      process.exit(-1)
                    }

                    const abi = JSON.parse((fs.readFileSync(`./build/contracts/${contractName}.json`).toString())).abi
                    console.log("ABI", abi);
                    console.log("blockchainAddress", blockchainAddress);

                    res({
                      truffleDevelopThread,
                      /* @ts-ignore:next-line */
                      contract: new Web3Contract(
                        abi,
                        line
                          .split('> contract address:')[1]
                          .trim()
                      ),
                      web3: new Web3(blockchainAddress),
                      users
                    });
                  }
                });
              tmt.on('close', (code) => {
                console.log(`tmt process exited with code ${code}`);
              });
            }

          });

          truffleDevelopThread.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });

          truffleDevelopThread.on('close', (code) => {
            console.log(`child process exited with code ${code}`);



          });
        });
      },

      afterEach: ({ truffleDevelopThread }) => truffleDevelopThread.kill(),

      andWhen: async ({ truffleDevelopThread, web3, contract, users }, callback: any, testResource: never) => {
        console.log("andWhen", callback.toString())

        // await act(() => actioner()(renderer))
        callback()({ contract, users })
        return { truffleDevelopThread, web3, contract, users };
        // const a = callback();
        // console.log("a", a)

        // return a[0](a[1]);
      },

    },
    entryPath
  )
