var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
import esbuild from "esbuild";
import Ganache from "ganache";
import Web3 from 'web3';
import { Testeranto } from "testeranto";
import { solCompile } from "../../solidity/truffle.mjs";
export const StorefrontTesteranto = (testImplementations, testSpecifications, testInput, contractName) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 0 }, {
    beforeAll: function ([bundlePath, htmlTemplate]) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                contract: (yield solCompile(contractName)).contracts
                    .find((c) => c.contractName === contractName),
                browser: yield puppeteer.launch({
                    headless: true,
                    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                }),
                htmlBundle: htmlTemplate(esbuild.buildSync({
                    entryPoints: [bundlePath],
                    bundle: true,
                    minify: false,
                    format: "esm",
                    target: ["esnext"],
                    write: false,
                }).outputFiles[0].text),
            };
        });
    },
    beforeEach: function (subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const subjectContract = subject.contract;
            const page = yield subject.browser.newPage();
            // https://github.com/trufflesuite/ganache#programmatic-use
            const provider = Ganache.provider({
                seed: "drizzle-utils",
                gasPrice: 7000000
            });
            /* @ts-ignore:next-line */
            const web3 = new Web3(provider);
            const accounts = yield web3.eth.getAccounts();
            /* @ts-ignore:next-line */
            const contract = yield (yield (new web3.eth.Contract(subjectContract.abi))
                /* @ts-ignore:next-line */
                .deploy({ data: subjectContract.bytecode.bytes })
                .send({ from: accounts[0], gas: 7000000 }));
            page.exposeFunction("AppInc", (x) => {
                contract.methods.inc().send({ from: accounts[1] });
            });
            page.exposeFunction("AppDec", (x) => {
                contract.methods.dec().send({ from: accounts[1] });
            });
            // eslint-disable-next-line no-async-promise-executor
            return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
                page.exposeFunction("AppBooted", (x) => __awaiter(this, void 0, void 0, function* () {
                    page.evaluate((gotten) => {
                        document.dispatchEvent(new CustomEvent('setCounterEvent', { detail: gotten }));
                    }, (yield contract.methods.get().call()));
                    res({
                        page,
                        contract,
                        accounts,
                        provider
                    });
                }));
                yield page.waitForTimeout(10);
                page.setContent(subject.htmlBundle);
            }));
        });
    },
    andWhen: function ({ page, contract, accounts }, actioner) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = yield actioner()({ page });
            yield page.waitForTimeout(10);
            yield page.evaluate((counter) => {
                document.dispatchEvent(new CustomEvent('setCounterEvent', ({ detail: counter })));
            }, yield contract.methods.get().call());
            return action;
        });
    },
    butThen: function ({ page, contract }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.waitForTimeout(10);
            yield page.evaluate((counter) => {
                document.dispatchEvent(new CustomEvent('setCounterEvent', ({ detail: counter })));
            }, yield contract.methods.get().call());
            return { page };
        });
    },
    afterEach: function ({ page, contract }, ndx, saveTestArtifact) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate((counter) => {
                document.dispatchEvent(new CustomEvent('setCounterEvent', ({ detail: counter })));
            }, yield contract.methods.get().call());
            saveTestArtifact.png(yield (yield page).screenshot());
            return { page };
        });
    }
});
