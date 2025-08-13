"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const chai_1 = require("chai");
exports.implementation = {
    suites: {
        Default: "Modal Content Tests",
    },
    givens: {
        Default: () => ({
            theme: "light",
            handleThemeChange: () => { },
        }),
    },
    whens: {},
    thens: {
        hasModalHeader: () => async ({ htmlElement }) => {
            const header = htmlElement.querySelector('.modal-header');
            chai_1.assert.exists(header, 'Should have Modal.Header');
            return { htmlElement };
        },
        hasThemeCards: () => async ({ htmlElement }) => {
            const themeCards = htmlElement.querySelectorAll('.theme-card');
            chai_1.assert.isAtLeast(themeCards.length, 1, 'Should render ThemeCard components');
            return { htmlElement };
        },
        takeScreenshot: (name) => async ({ htmlElement }, pm) => {
            const p = await pm.page();
            await pm.customScreenShot({ path: name }, p);
            return { htmlElement };
        },
    },
};
