import React, { useState, useEffect, useContext } from 'react';
import { Form } from 'react-bootstrap';
import { useTutorialMode } from '../../App';

export const Settings = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const { tutorialMode, setTutorialMode } = useTutorialMode();

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme when it changes
    applyTheme(theme);
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const applyTheme = (selectedTheme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;

    if (selectedTheme === 'auto') {
      // Use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.setAttribute('data-bs-theme', 'dark');
      } else {
        root.setAttribute('data-bs-theme', 'light');
      }
    } else {
      root.setAttribute('data-bs-theme', selectedTheme);
    }
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value as 'light' | 'dark' | 'auto');
  };

  const handleTutorialModeChange = () => {
    const newTutorialMode = !tutorialMode;
    setTutorialMode(newTutorialMode);
    // Save to localStorage
    localStorage.setItem('tutorialMode', newTutorialMode.toString());
  };

  return (
    <div>
      <Form>
        <Form.Group className="mb-4">
          <div>
            <Form.Check
              type="radio"
              id="theme-light"
              name="theme"
              value="light"
              label="Light mode"
              checked={theme === 'light'}
              onChange={handleThemeChange}
            />
            <Form.Check
              type="radio"
              id="theme-dark"
              name="theme"
              value="dark"
              label="Dark mode"
              checked={theme === 'dark'}
              onChange={handleThemeChange}
            />
            <Form.Check
              type="radio"
              id="theme-auto"
              name="theme"
              value="auto"
              label="Auto mode. Use system setting"
              checked={theme === 'auto'}
              onChange={handleThemeChange}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="switch"
            id="tutorial-mode"
            label={tutorialMode ? "Tutorial Mode: ON" : "Tutorial Mode: OFF"}
            checked={tutorialMode}
            onChange={handleTutorialModeChange}
          />
          <Form.Text className="text-muted">
            When enabled, helpful tooltips will appear throughout the app to guide you.
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  );
};
