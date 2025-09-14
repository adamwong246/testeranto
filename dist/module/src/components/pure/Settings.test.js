import React from 'react';
import { render, screen } from '@testing-library/react';
import { Settings } from './Settings';
// Mock the tutorial mode context
jest.mock('../../App', () => ({
    useTutorialMode: () => ({
        tutorialMode: false,
        setTutorialMode: jest.fn()
    })
}));
test('renders settings page', () => {
    render(React.createElement(Settings, null));
    const themeLabel = screen.getByText(/Theme/i);
    expect(themeLabel).toBeInTheDocument();
});
test('renders theme options', () => {
    render(React.createElement(Settings, null));
    const lightModeOption = screen.getByLabelText(/Light Mode/i);
    const darkModeOption = screen.getByLabelText(/Dark Mode/i);
    const autoModeOption = screen.getByLabelText(/Auto/i);
    expect(lightModeOption).toBeInTheDocument();
    expect(darkModeOption).toBeInTheDocument();
    expect(autoModeOption).toBeInTheDocument();
});
test('renders tutorial mode switch', () => {
    render(React.createElement(Settings, null));
    const tutorialModeSwitch = screen.getByLabelText(/Tutorial Mode: OFF/i);
    expect(tutorialModeSwitch).toBeInTheDocument();
});
