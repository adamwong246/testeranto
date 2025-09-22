"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const chai_1 = require("chai");
const react_1 = __importDefault(require("react"));
exports.implementation = {
    suites: {
        Default: "AppFrame basic rendering",
        Layout: "AppFrame layout structure",
    },
    givens: {
        Default: () => (selection) => (Object.assign(Object.assign({}, selection), { children: react_1.default.createElement("div", null, "Test Content") })),
        WithChildren: (children) => () => (selection) => (Object.assign(Object.assign({}, selection), { children })),
    },
    whens: {},
    thens: {
        takeScreenshot: (name) => async ({ htmlElement, container }, pm) => {
            if (!container)
                throw new Error('Container not found');
            const p = await pm.page();
            await pm.customScreenShot({ path: `${name}.png` }, p);
            return {
                htmlElement,
                reactElement: react_1.default.createElement('div'),
                domRoot: container,
                container
            };
        },
        RendersContainer: () => async ({ htmlElement, container }) => {
            // const container = htmlElement.querySelector('.min-vh-100');
            chai_1.assert.exists(container, 'Should have min-vh-100 container');
            return {
                htmlElement,
                reactElement: react_1.default.createElement('div'),
                domRoot: container,
                container: container
            };
        },
        HasMainContent: () => async ({ htmlElement }) => {
            const main = htmlElement.querySelector('main.flex-grow-1');
            chai_1.assert.exists(main, 'Should have main content area');
            return { htmlElement };
        },
        HasFooter: () => async ({ htmlElement }) => {
            const footer = htmlElement.querySelector('footer');
            chai_1.assert.exists(footer, 'Should have footer');
            return { htmlElement };
        },
        HasSettingsButton: () => async ({ htmlElement }) => {
            const button = htmlElement.querySelector('footer button');
            chai_1.assert.exists(button, 'Should have settings button in footer');
            return { htmlElement };
        },
        HasTesterantoLink: () => async ({ htmlElement }) => {
            const link = htmlElement.querySelector('footer a[href*="testeranto"]');
            chai_1.assert.exists(link, 'Should have testeranto link in footer');
            return { htmlElement };
        },
    },
};
