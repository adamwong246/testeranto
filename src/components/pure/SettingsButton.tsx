import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { ModalContent } from "./ModalContent";
import SunriseAnimation from "../SunriseAnimation";

export const SettingsButton = ({ className }: { className?: string }) => {
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);
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

    // Animation is now handled by SunriseAnimation component
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

      <SunriseAnimation active={theme === 'daily'} />

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <ModalContent theme={theme} handleThemeChange={handleThemeChange} />
        <Modal.Footer className="border-0">
          <Button variant="btn-primary" onClick={() => setShowModal(false)}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
