import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col } from 'react-bootstrap';
// import { AppFrame } from '../pure/AppFrame';

export const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    let themeToApply = theme;
    if (theme === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-bs-theme', themeToApply);
  }, [theme]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    let themeToApply = newTheme;
    if (newTheme === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-bs-theme', themeToApply);
  };

  return (

    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="theme-card">
            {/* <Card.Header className="bg-transparent border-0">
              <h4 className="mb-0">Appearance</h4>
            </Card.Header> */}
            <Card.Body>
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="h6 mb-3">Theme</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    <Form.Check
                      type="radio"
                      name="theme"
                      id="light-theme"
                      label="Light"
                      value="light"
                      checked={theme === 'light'}
                      onChange={handleThemeChange}
                      className="theme-option"
                    />
                    <Form.Check
                      type="radio"
                      name="theme"
                      id="dark-theme"
                      label="Dark"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={handleThemeChange}
                      className="theme-option"
                    />
                    <Form.Check
                      type="radio"
                      name="theme"
                      id="system-theme"
                      label="System"
                      value="system"
                      checked={theme === 'system'}
                      onChange={handleThemeChange}
                      className="theme-option"
                    />
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

  );
};
