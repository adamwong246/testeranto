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
import { StorefrontTesteranto } from "./index.testeranto.test";
import storefront from "../../../src/storefront";
export const StorefrontTest = StorefrontTesteranto({
    Suites: {
        Default: "default storefront suite",
    },
    Givens: {
        AnEmptyState: () => {
            return;
        },
    },
    Whens: {
        Increment: () => ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
            yield page.click("#inc");
        }),
        Decrement: () => ({ page }) => __awaiter(void 0, void 0, void 0, function* () { return yield page.click("#dec"); }),
    },
    Thens: {
        TheCounterIs: (expectation) => ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
            assert.deepEqual(yield page.$eval("#counter", (el) => el.innerHTML), JSON.stringify(expectation));
        }),
    },
    Checks: {
        AnEmptyState: () => {
            return {};
        },
    },
}, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("the storefront react app, alpha", [
            Given.AnEmptyState([`federatedSplitContract`], [], [
                Then.TheCounterIs(0)
            ]),
            Given.AnEmptyState([], [When.Increment()], [
                Then.TheCounterIs(1)
            ]),
            Given.AnEmptyState([], [
                When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(),
            ], [
                Then.TheCounterIs(6)
            ]),
            Given.AnEmptyState([], [
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
            ], [
                Then.TheCounterIs(36)
            ]),
        ], []),
    ];
}, [
    "./tests/storefront/alpha/testIndex.test.tsx",
    (jsbundle) => `
            <!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module">${jsbundle}</script>
    </head>

    <body>
      <div id="root">
        <p>loading...</p>
      </div>
    </body>

    <footer></footer>

    </html>
`,
    storefront,
], "MyFirstContract");
