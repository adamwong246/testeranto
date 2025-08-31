import React, { useState, useEffect, useContext } from 'react';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useTutorialMode, useAuth } from '../../App';
import { GitHubLoginButton } from './GitHubLoginButton';
import { githubAuthService } from '../../services/GitHubAuthService';
import { DebugEnv } from './DebugEnv';

export const Settings = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const { tutorialMode, setTutorialMode } = useTutorialMode();
  const { isAuthenticated, user, logout } = useAuth();

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
    <Container>
      <Row>
        <Col md={8} lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Appearance</h5>
            </Card.Header>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* GitHub Authentication Section */}
      <Row className="mt-4">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">GitHub Integration</h5>
            </Card.Header>
            <Card.Body>
              {githubAuthService.isConfigured() ? (
                isAuthenticated ? (
                  <div>
                    <p>Connected as: {user?.login}</p>
                    <Button variant="outline-danger" onClick={logout}>
                      Disconnect GitHub
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p>Connect your GitHub account to enable Git operations:</p>
                    <GitHubLoginButton />
                  </div>
                )
              ) : (
                <div>
                  <p className="text-danger">GitHub integration is not configured.</p>
                  <p>To enable GitHub authentication:</p>
                  <ol className="small">
                    <li>Create a GitHub OAuth App at https://github.com/settings/developers</li>
                    <li>Set Authorization callback URL to: {window.location.origin}/auth/github/callback</li>
                    <li>Update the clientId in testeranto.config.ts</li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Environment Debug Info */}
      {/* <DebugEnv /> */}
    </Container>
  );
};
