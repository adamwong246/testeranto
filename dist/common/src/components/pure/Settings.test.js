"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const Settings_1 = require("./Settings");
// Mock the tutorial mode context
jest.mock('../../App', () => ({
    useTutorialMode: () => ({
        tutorialMode: false,
        setTutorialMode: jest.fn()
    })
}));
test('renders settings page', () => {
    (0, react_2.render)(react_1.default.createElement(Settings_1.Settings, null));
    const themeLabel = react_2.screen.getByText(/Theme/i);
    expect(themeLabel).toBeInTheDocument();
});
test('renders theme options', () => {
    (0, react_2.render)(react_1.default.createElement(Settings_1.Settings, null));
    const lightModeOption = react_2.screen.getByLabelText(/Light Mode/i);
    const darkModeOption = react_2.screen.getByLabelText(/Dark Mode/i);
    const autoModeOption = react_2.screen.getByLabelText(/Auto/i);
    expect(lightModeOption).toBeInTheDocument();
    expect(darkModeOption).toBeInTheDocument();
    expect(autoModeOption).toBeInTheDocument();
});
test('renders tutorial mode switch', () => {
    (0, react_2.render)(react_1.default.createElement(Settings_1.Settings, null));
    const tutorialModeSwitch = react_2.screen.getByLabelText(/Tutorial Mode: OFF/i);
    expect(tutorialModeSwitch).toBeInTheDocument();
});
