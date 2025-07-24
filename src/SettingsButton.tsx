import React, { useState, useEffect } from "react";
import SunriseAnimation from "./components/SunriseAnimation";
import { Modal, Button } from "react-bootstrap";
// import "./TestReport.scss";

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
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-palette-fill me-2"></i>
            <span>Settings</span>
          </Modal.Title>
        </Modal.Header>
        <div className="alert alert-warning mx-3 mt-2 mb-0">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Warning:</strong> Themes are an experimental feature. Only "Business casual" is fully supported at this time.
        </div>
        <Modal.Body className="p-0">
          <div className="p-3">
            <div className="row g-3">
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'system' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'system' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderColor: '#adb5bd'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-0">9 to 5</h5>
                    <p className="small text-muted mb-0">Follows your OS theme</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'light' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'light' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%)',
                    borderColor: '#ced4da',
                    color: '#212529',
                    borderWidth: '2px'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-1">Business casual</h5>
                    <p className="small text-muted mb-0">Clean & professional</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'dark' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'dark' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    borderColor: '#4ecdc4',
                    color: '#f8f9fa',
                    borderWidth: '2px'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-1">Business formal</h5>
                    <p className="small text-muted mb-0">Premium & focused</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'light-vibrant' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'light-vibrant' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #ff2d75 0%, #00e5ff 100%)',
                    borderColor: '#ffeb3b',
                    color: '#fff'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-1">Office Party</h5>
                    <p className="small text-muted mb-0">Colorful & fun</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'dark-vibrant' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'dark-vibrant' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #16213e 0%, #e94560 100%)',
                    borderColor: '#00e5ff',
                    color: '#fff'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-1">After Party</h5>
                    <p className="small text-muted mb-0">Neon nightlife</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'sepia' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'sepia' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #f4ecd8 0%, #d0b88f 100%)',
                    borderColor: '#8b6b4a',
                    color: '#3a3226'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-1">WFH</h5>
                    <p className="small text-muted mb-0">Vintage warmth</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'light-grayscale' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'light-grayscale' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    borderColor: '#666',
                    color: '#333',
                    borderWidth: '2px'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-1">Serious Business</h5>
                    <p className="small text-muted mb-0">Simple & distraction-free</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'dark-grayscale' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'dark-grayscale' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                    borderColor: '#ff6b6b',
                    color: '#e0e0e0',
                    borderWidth: '2px'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-1">Very Serious business</h5>
                    <p className="small text-muted mb-0">Maximum readability</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'daily' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'daily' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #6eafff 0%, #f9fbf0 100%)',
                    borderColor: '#f7d62e',
                    color: '#00192d'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-1">Dreaming of PTO</h5>
                    <p className="small text-muted mb-0">Sunrise, sunset</p>
                  </div>
                </div>
              </div>
              {/* Color Blind Themes */}
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'protanopia' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'protanopia' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e0e8ff 100%)',
                    borderColor: '#3366cc',
                    color: '#333'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-0">Protanopia</h5>
                    <p className="small text-muted mb-0">Red-blind mode</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'deuteranopia' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'deuteranopia' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffe0e0 100%)',
                    borderColor: '#cc6633',
                    color: '#333'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-0">Deuteranopia</h5>
                    <p className="small text-muted mb-0">Green-blind mode</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card theme-card ${theme === 'tritanopia' ? 'border-primary' : ''}`}
                  onClick={() => handleThemeChange({ target: { value: 'tritanopia' } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e0ffe0 100%)',
                    borderColor: '#00aa66',
                    color: '#333'
                  }}
                >
                  <div className="card-body text-center p-3">
                    <h5 className="card-title mb-0">Tritanopia</h5>
                    <p className="small text-muted mb-0">Blue-blind mode</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="btn-primary" onClick={() => setShowModal(false)}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
