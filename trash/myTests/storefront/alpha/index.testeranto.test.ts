import { PassThrough } from "stream";
import puppeteer, { Browser, Page } from "puppeteer";
import esbuild from "esbuild";
import { Contract } from 'web3-eth-contract';
import Ganache from "ganache";
import Web3 from 'web3';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

import { CompiledContract } from "@truffle/compile-common";

import Testeranto from "testeranto";

import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto";

import { solCompile } from "../../solidity/truffle.mjs";
import { BaseFeature } from "testeranto/src/Features.js";
import { MyFeature } from "../../testerantoFeatures.test.mjs";

type Input = [
  string,
  (string) => string,
  any
];
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;
type Selection = { page: Page };
type State = void;

type Subject = {
  browser: Browser;
  htmlBundle: string;
  contract: CompiledContract
};

type Store = {
  page: Page,
  contract: Contract,
  accounts,
  provider: unknown,
  recorder: PuppeteerScreenRecorder;
};

export const StorefrontTesteranto = <
  ITestShape extends ITTestShape,
  IFeatureShape extends Record<string, MyFeature>,
>(
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape, IFeatureShape>,
  testInput: Input,
  contractName: string,
  testName: string,
) =>
  Testeranto<
    ITestShape,
    Input,
    Subject,
    Store,
    Selection,
    ThenShape,
    WhenShape,
    InitialState,
    IFeatureShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async function ([bundlePath, htmlTemplate]: Input): Promise<Subject> {

        return {

          contract: (
            await solCompile(contractName)).contracts
            .find((c) => c.contractName === contractName) as CompiledContract,

          browser: await puppeteer.launch({
            headless: true,
            executablePath:
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          }),
          htmlBundle: htmlTemplate(
            esbuild.buildSync({
              entryPoints: [bundlePath],
              bundle: true,
              minify: false,
              format: "esm",
              target: ["esnext"],
              write: false,
            }).outputFiles[0].text
          ),
        };
      },

      beforeEach: async function (subject: Subject, ndx, testResource, artifacter): Promise<Store> {
        const subjectContract = subject.contract;

        const page = await subject.browser.newPage();


        const recorder = new PuppeteerScreenRecorder(page, {
          followNewTab: false,
          fps: 25,
          videoFrame: {
            width: 1024,
            height: 768,
          },
          videoCrf: 18,
          videoCodec: 'libx264',
          videoPreset: 'ultrafast',
          videoBitrate: 1000,
          autopad: {
            color: 'black',
          },
          aspectRatio: '4:3',
        });
        const pipeStream = new PassThrough();
        artifacter("./screencap.mp4", pipeStream);
        await recorder.startStream(pipeStream);

        // https://github.com/trufflesuite/ganache#programmatic-use
        const provider = Ganache.provider({
          seed: "drizzle-utils",
          gasPrice: 7000000
        });

        /* @ts-ignore:next-line */
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();

        /* @ts-ignore:next-line */
        const contract = await (await (new web3.eth.Contract(subjectContract.abi))
          /* @ts-ignore:next-line */
          .deploy({ data: subjectContract.bytecode.bytes })
          .send({ from: accounts[0], gas: 7000000 }));

        page.exposeFunction("AppInc", (x) => {
          contract.methods.inc().send({ from: accounts[1] })
        });

        page.exposeFunction("AppDec", (x) => {
          contract.methods.dec().send({ from: accounts[1] })
        });

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res) => {
          page.exposeFunction("AppBooted", async (x) => {

            page.evaluate((gotten) => {
              document.dispatchEvent(new CustomEvent<number>('setCounterEvent', { detail: gotten }));
            }, (await contract.methods.get().call()));

            res({
              page,
              contract,
              accounts,
              provider,
              recorder
            });

          })

          await page.waitForTimeout(10);
          page.setContent(subject.htmlBundle);

        });


      },
      andWhen: async function ({ page, contract, accounts }: Store, actioner): Promise<Selection> {
        const action = await actioner()({ page });
        await page.waitForTimeout(10);

        await page.evaluate((counter) => {
          document.dispatchEvent(new CustomEvent<number>('setCounterEvent', ({ detail: counter })));
        }, await contract.methods.get().call());

        return action
      },
      butThen: async function ({ page, contract }: Store): Promise<Selection> {
        await page.waitForTimeout(10);

        await page.evaluate((counter) => {
          document.dispatchEvent(new CustomEvent<number>('setCounterEvent', ({ detail: counter })));
        }, await contract.methods.get().call());

        return { page, };
      },
      afterEach: async function ({ page, contract, recorder }: Store, ndx: number, artifacter) {
        recorder.stop()
        await page.evaluate((counter) => {
          document.dispatchEvent(new CustomEvent<number>('setCounterEvent', ({ detail: counter })));
        }, await contract.methods.get().call());


        artifacter("screenshotr.png", await (await page).screenshot());

        return { page };
      }
    },
    testName
  )
