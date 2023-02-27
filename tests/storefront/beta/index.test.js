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
import { features } from "../../testerantoFeatures.test";
import { StorefrontTesteranto } from "./index.testeranto.test";
import Storefront from "../../../src/storefront";
export const StorefrontTestBeta = StorefrontTesteranto({
    Suites: {
        Default: "default storefront suite",
    },
    Givens: {
        AnEmptyState: () => {
            return;
        },
    },
    Whens: {
        Increment: () => ({ rendereredComponent }) => __awaiter(void 0, void 0, void 0, function* () { return yield rendereredComponent.root.findByProps({ id: "inc" }).props.onClick(); }),
        Decrement: () => ({ rendereredComponent }) => __awaiter(void 0, void 0, void 0, function* () { return yield rendereredComponent.root.findByProps({ id: "dec" }).props.onClick(); })
    },
    Thens: {
        TheCounterIs: (expectation) => ({ rendereredComponent }) => __awaiter(void 0, void 0, void 0, function* () { return assert.deepEqual(expectation, (rendereredComponent.toTree().rendered.rendered[1].rendered.toString())); }),
    },
    Checks: {
        AnEmptyState: () => {
            return {};
        },
    },
}, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("the storefront react app, beta", [
            Given.AnEmptyState([features.federatedSplitContract], [], [
                Then.TheCounterIs('0')
            ]),
            Given.AnEmptyState([], [
                When.Increment(),
                When.Increment(),
                When.Increment(),
                When.Increment()
            ], [
                Then.TheCounterIs('4'),
            ]),
            Given.AnEmptyState([], [
                When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(),
            ], [
                Then.TheCounterIs("6")
            ]),
            Given.AnEmptyState([], [
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
                When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
            ], [
                Then.TheCounterIs("36")
            ]),
        ], []),
    ];
}, {
    contractName: "MyFirstContract",
    component: Storefront
});
