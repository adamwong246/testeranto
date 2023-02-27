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
import { Testeranto } from "testeranto";
export const EsbuildPuppeteerTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 0 }, {
    beforeAll: function ([bundlePath, htmlTemplate]) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                page: yield (yield puppeteer.launch({
                    headless: true,
                    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                })).newPage(),
                htmlBundle: htmlTemplate(esbuild.buildSync({
                    entryPoints: [bundlePath],
                    bundle: true,
                    minify: true,
                    format: "esm",
                    target: ["esnext"],
                    write: false,
                }).outputFiles[0].text),
            };
        });
    },
    beforeEach: function (subject) {
        return subject.page.setContent(subject.htmlBundle).then(() => {
            return { page: subject.page };
        });
    },
    andWhen: function ({ page }, actioner) {
        return actioner()({ page });
    },
    butThen: function ({ page }) {
        return __awaiter(this, void 0, void 0, function* () {
            return { page };
        });
    },
    afterEach: function ({ page }, ndx, saveTestArtifact) {
        return __awaiter(this, void 0, void 0, function* () {
            saveTestArtifact.png(yield (yield page).screenshot());
            return { page };
        });
    }
});
