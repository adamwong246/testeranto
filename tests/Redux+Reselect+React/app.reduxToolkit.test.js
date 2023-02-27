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
import { ReduxToolkitTesteranto } from "./reduxToolkit.testeranto.test";
import { loginApp } from "./app";
import app from "./app";
const core = app();
const selector = core.select.loginPageSelection;
const actions = core.app.actions;
const reducer = core.app.reducer;
const myFeature = `hello`;
export const AppReduxToolkitTesteranto = ReduxToolkitTesteranto({
    Suites: {
        Default: "some default Suite",
    },
    Givens: {
        AnEmptyState: () => {
            return loginApp.getInitialState();
        },
        AStateWithEmail: (email) => {
            return Object.assign(Object.assign({}, loginApp.getInitialState()), { email });
        },
    },
    Whens: {
        TheLoginIsSubmitted: () => [loginApp.actions.signIn],
        TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
        ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password],
    },
    Thens: {
        TheEmailIs: (email) => (selection) => [assert.equal, selection.email, email, "a nice message"],
        TheEmailIsNot: (email) => (selection) => [assert.notEqual, selection.email, email],
        ThePasswordIs: (password) => (selection) => [assert.equal, selection.password, password],
        ThePasswordIsNot: (password) => (selection) => [assert.notEqual, selection.password, password],
    },
    Checks: {
        AnEmptyState: () => loginApp.getInitialState(),
    },
}, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("Testing the ReduxToolkit", [
            Given.AnEmptyState([], [When.TheEmailIsSetTo("adam@email.com")], [Then.TheEmailIs("adam@email.com")]),
            Given.AStateWithEmail([], [When.TheEmailIsSetTo("hello")], [Then.TheEmailIsNot("adam@email.com")], "bob@mail.com"),
            Given.AnEmptyState([], [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")], [Then.TheEmailIs("aloha")]),
            Given.AnEmptyState([], [], [Then.TheEmailIs("")]),
        ], [
            Check.AnEmptyState("imperative style", [], ({ TheEmailIsSetTo }, { TheEmailIs }) => __awaiter(void 0, void 0, void 0, function* () {
                yield TheEmailIsSetTo("foo");
                yield TheEmailIs("foo");
                const reduxPayload = yield TheEmailIsSetTo("foobar");
                yield TheEmailIs("foobar");
                // assert.deepEqual(reduxPayload, {
                //   type: "login app/setEmail",
                //   payload: "foobar",
                // });
            })),
        ]),
    ];
}, { reducer, selector });
