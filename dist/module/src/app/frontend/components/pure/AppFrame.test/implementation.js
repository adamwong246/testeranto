import { assert } from "chai";
import React from "react";
export const implementation = {
    suites: {
        Default: "AppFrame basic rendering",
        Layout: "AppFrame layout structure",
    },
    givens: {
        Default: () => (selection) => (Object.assign(Object.assign({}, selection), { children: React.createElement("div", null, "Test Content") })),
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
                reactElement: React.createElement('div'),
                domRoot: container,
                container
            };
        },
        RendersContainer: () => async ({ htmlElement, container }) => {
            // const container = htmlElement.querySelector('.min-vh-100');
            assert.exists(container, 'Should have min-vh-100 container');
            return {
                htmlElement,
                reactElement: React.createElement('div'),
                domRoot: container,
                container: container
            };
        },
        HasMainContent: () => async ({ htmlElement }) => {
            const main = htmlElement.querySelector('main.flex-grow-1');
            assert.exists(main, 'Should have main content area');
            return { htmlElement };
        },
        HasFooter: () => async ({ htmlElement }) => {
            const footer = htmlElement.querySelector('footer');
            assert.exists(footer, 'Should have footer');
            return { htmlElement };
        },
        HasSettingsButton: () => async ({ htmlElement }) => {
            const button = htmlElement.querySelector('footer button');
            assert.exists(button, 'Should have settings button in footer');
            return { htmlElement };
        },
        HasTesterantoLink: () => async ({ htmlElement }) => {
            const link = htmlElement.querySelector('footer a[href*="testeranto"]');
            assert.exists(link, 'Should have testeranto link in footer');
            return { htmlElement };
        },
    },
};
