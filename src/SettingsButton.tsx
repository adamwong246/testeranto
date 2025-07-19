import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./TestReport.scss";

export const SettingsButton = ({ className }: { className?: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Remove all theme classes first
    // document.body.classList.remove('light-theme', 'dark-theme', 'lovely-theme', 'light-grayscale-theme', 'dark-grayscale-theme', 'sepia-theme');

    let themeToApply = newTheme;
    if (newTheme === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    document.documentElement.setAttribute('data-bs-theme', themeToApply);
    // document.body.classList.add(`${themeToApply}-theme`);
  };

  return (
    <>
      <div id="settings-button">
        <button
          className={`btn btn-sm btn-outline-secondary ${className}`}
          onClick={() => setShowModal(true)}
        >
          <div id="gear-icon-settings">⚙️</div>
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>⚙️ Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Theme</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  id="theme-system"
                  label="🖥️ 9-5"
                  name="theme"
                  value="system"
                  checked={theme === 'system'}
                  onChange={handleThemeChange}
                />
                <Form.Check
                  type="radio"
                  id="theme-light"
                  label="☀️ Business-casual"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={handleThemeChange}
                />
                <Form.Check
                  type="radio"
                  id="theme-dark"
                  label="🌙 Business-formal"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={handleThemeChange}
                />
                <Form.Check
                  type="radio"
                  id="theme-light-vibrant"
                  label="🎉 Office party"
                  name="theme"
                  value="light-vibrant"
                  checked={theme === 'light-vibrant'}
                  onChange={handleThemeChange}
                />
                <Form.Check
                  type="radio"
                  id="theme-dark-vibrant"
                  label="🌃 After party"
                  name="theme"
                  value="dark-vibrant"
                  checked={theme === 'dark-vibrant'}
                  onChange={handleThemeChange}
                />
                <Form.Check
                  type="radio"
                  id="theme-light-grayscale"
                  label="💼 Serious Business"
                  name="theme"
                  value="light-grayscale"
                  checked={theme === 'light-grayscale'}
                  onChange={handleThemeChange}
                />
                <Form.Check
                  type="radio"
                  id="theme-dark-grayscale"
                  label="🕶️ Very Serious Business"
                  name="theme"
                  value="dark-grayscale"
                  checked={theme === 'dark-grayscale'}
                  onChange={handleThemeChange}
                />
                <Form.Check
                  type="radio"
                  id="theme-sepia"
                  label="🏡 WFH"
                  name="theme"
                  value="sepia"
                  checked={theme === 'sepia'}
                  onChange={handleThemeChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
