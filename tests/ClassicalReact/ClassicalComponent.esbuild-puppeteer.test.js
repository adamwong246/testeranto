var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from "chai";
import { EsbuildPuppeteerTesteranto } from "./esbuild-puppeteer.testeranto.test";
import { ClassicalComponent } from "./ClassicalComponent";
const myFeature = `hello`;
export const ClassicalComponentEsbuildPuppeteerTesteranto = EsbuildPuppeteerTesteranto({
    Suites: {
        Default: "some default Suite",
    },
    Givens: {
        AnEmptyState: () => {
            return;
        },
    },
    Whens: {
        IClickTheButton: () => ({ page }) => __awaiter(void 0, void 0, void 0, function* () { return yield page.click("#theButton"); }),
    },
    Thens: {
        ThePropsIs: (expectation) => ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
            assert.deepEqual(yield page.$eval("#theProps", (el) => el.innerHTML), JSON.stringify(expectation));
        }),
        TheStatusIs: (expectation) => ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
            return assert.deepEqual(yield page.$eval("#theState", (el) => el.innerHTML), JSON.stringify(expectation));
        }),
    },
    Checks: {
        AnEmptyState: () => {
            return {};
        },
    },
}, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("a classical react component, bundled with esbuild and tested with puppeteer", [
            Given.AnEmptyState([], [], [
                Then.ThePropsIs({}),
                Then.TheStatusIs({ count: 0 })
            ]),
            Given.AnEmptyState([], [When.IClickTheButton()], [
                Then.ThePropsIs({}),
                Then.TheStatusIs({ count: 1 })
            ]),
            Given.AnEmptyState([`hello`], [
                When.IClickTheButton(),
                When.IClickTheButton(),
                When.IClickTheButton(),
            ], [Then.TheStatusIs({ count: 3 })]),
            Given.AnEmptyState([`hello`], [
                When.IClickTheButton(),
                When.IClickTheButton(),
                When.IClickTheButton(),
                When.IClickTheButton(),
                When.IClickTheButton(),
                When.IClickTheButton(),
            ], [Then.TheStatusIs({ count: 6 })]),
        ], []),
    ];
}, [
    "./tests/ClassicalReact/index.ts",
    (jsbundle) => `
            <!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module">${jsbundle}</script>
    </head>

    <body>
      <div id="root">
      </div>
    </body>

    <footer></footer>

    </html>
`,
    ClassicalComponent,
]);
