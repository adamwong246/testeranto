import { assert } from "chai";
import Testeranto from "./SubPackages/react-dom/jsx/web";
import LoginButton from "./LoginButton";
const implementations = {
    suites: {
        Default: "a default suite",
    },
    givens: {
        default: () => (i) => {
            console.log("default");
            return i;
        },
    },
    whens: {
        Clicked: () => async (x, utils) => {
            const pages = await utils.browser.pages();
            const page = pages.find((p) => {
                return p.url() === "file:///Users/adam/Code/testeranto/docs/web/src/LoginButton.test.html";
            });
            await page.evaluate(() => {
                var _a;
                (_a = document.getElementById("signin")) === null || _a === void 0 ? void 0 : _a.click();
            });
            return;
        },
    },
    thens: {
        ItSaysLogIn: () => (reactElem) => {
            return assert.equal(reactElem.htmlElement.innerText, "Log in");
        },
        ItSaysSignOut: () => (reactElem) => {
            return assert.equal(reactElem.htmlElement.innerText, "Sign out");
        }
    },
    checks: {
        default: () => (i) => {
            return i;
        },
    },
};
export const LoginPageSpecs = (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("Testing the LoginButton", {
            test0: Given.default(["0"], [], [Then.ItSaysLogIn()]),
            test1: Given.default(["0"], [When.Clicked()], [Then.ItSaysSignOut()]),
            test2: Given.default(["0"], [When.Clicked(), When.Clicked()], [Then.ItSaysLogIn()]),
            test3: Given.default(["1"], [When.Clicked(), When.Clicked(), When.Clicked()], [Then.ItSaysSignOut()]),
        }, []),
    ];
};
export default Testeranto(implementations, LoginPageSpecs, LoginButton);
