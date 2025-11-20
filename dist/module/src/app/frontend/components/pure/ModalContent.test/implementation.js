import { assert } from "chai";
export const implementation = {
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
        hasModalHeader: () => (state) => {
            var _a;
            const header = (_a = state.htmlElement) === null || _a === void 0 ? void 0 : _a.querySelector('.modal-header');
            assert.exists(header, 'Should have Modal.Header');
            return state;
        },
        hasThemeCards: () => (state) => {
            var _a;
            const themeCards = (_a = state.htmlElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.theme-card');
            assert.isAtLeast(themeCards === null || themeCards === void 0 ? void 0 : themeCards.length, 1, 'Should render ThemeCard components');
            return state;
        },
        takeScreenshot: (name) => async (state, pm) => {
            // For web tests, we can use the PM's screenshot capability
            // The actual implementation will be handled by the test runner
            return state;
        },
    },
};
