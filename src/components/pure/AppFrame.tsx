/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Container, Nav, OverlayTrigger, Tooltip, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { useWebSocket, useTutorialMode, useAuth } from '../../App';
import { UserProfile } from './UserProfile';

type AppFrameProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
  title?: string;
  rightContent?: React.ReactNode;
};

export const AppFrame = ({ children, title, rightContent }: AppFrameProps) => {
  const location = useLocation();
  const { isConnected } = useWebSocket();
  const { tutorialMode } = useTutorialMode();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="d-flex min-vh-100" >
      {/* Sidebar - Always 60px wide, full height */}
      <div
        className="border-end d-flex flex-column"
        style={{
          width: '60px',
          height: '100vh',
          position: 'sticky',
          top: 0
        }}
      >
        {/* Logo - Not clickable */}
        {tutorialMode ? (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="logo-tooltip">
                Welcome to Testeranto!
              </Tooltip>
            }
          >
            <div className="p-3 border-bottom d-flex align-items-center justify-content-center">
              <img
                src="/logo.svg"
                alt="Testeranto Logo"
                style={{
                  width: '40px',
                  height: '40px'
                }}
              />
            </div>
          </OverlayTrigger>
        ) : (
          <div className="p-3 border-bottom d-flex align-items-center justify-content-center">
            <img
              src="/logo.svg"
              alt="Testeranto Logo"
              style={{
                width: '40px',
                height: '40px'
              }}
            />
          </div>
        )}

        {/* Navigation */}
        <Nav variant="pills" className="flex-column p-2 flex-grow-1">
          {/* Projects Link - Always clickable with hover, tutorial tooltip conditionally */}
          <Nav.Link
            as={NavLink}
            to="/"
            className={`${location.pathname === '/' ? 'active' : ''} d-flex align-items-center justify-content-center`}
            style={{ height: '40px', width: '40px' }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="projects-tooltip">
                    Projects
                  </Tooltip>
                }
              >
                <span>📁</span>
              </OverlayTrigger>
            ) : (
              <span>📁</span>
            )}
          </Nav.Link>

          {/* Process Manager Link - Darken if not authenticated or not connected */}
          <Nav.Link
            as={NavLink}
            to="/processes"
            className={`${location.pathname.startsWith('/processes') ? 'active' : ''} d-flex align-items-center justify-content-center ${!isConnected || !isAuthenticated ? 'text-muted pe-none' : ''}`}
            style={{
              height: '40px',
              width: '40px',
              opacity: isConnected && isAuthenticated ? 1 : 0.6
            }}
            onClick={(e) => {
              if (!isConnected || !isAuthenticated) {
                e.preventDefault();
              }
            }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="processes-tooltip">
                    Processes {!isAuthenticated ? '(Sign in required)' : !isConnected ? '(WebSocket disconnected)' : ''}
                  </Tooltip>
                }
              >
                <span>📊</span>
              </OverlayTrigger>
            ) : (
              <span>📊</span>
            )}
          </Nav.Link>

          {/* Git Integration Link - Darken if not authenticated */}
          <Nav.Link
            as={NavLink}
            to="/git"
            className={`${location.pathname === '/git' ? 'active' : ''} d-flex align-items-center justify-content-center ${!isAuthenticated ? 'text-muted pe-none' : ''}`}
            style={{
              height: '40px',
              width: '40px',
              opacity: isAuthenticated ? 1 : 0.6
            }}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
              }
            }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="git-tooltip">
                    Git Integration {!isAuthenticated ? '(Sign in required)' : ''}
                  </Tooltip>
                }
              >
                <span>🐙</span>
              </OverlayTrigger>
            ) : (
              <span>🐙</span>
            )}
          </Nav.Link>


          <Nav.Link
            as={NavLink}
            to="/design-editor"
            className={`${location.pathname === '/design-editor' ? 'active' : ''} d-flex align-items-center justify-content-center`}
            style={{
              height: '40px',
              width: '40px',
              opacity: isAuthenticated ? 1 : 0.6
            }}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
              }
            }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="design-editor-tooltip">
                  Canvas editor
                </Tooltip>
                }
              >
                <span>kanvaso</span>
              </OverlayTrigger>
            ) : (
              <span>kanvaso</span>
            )}
          </Nav.Link>


          <Nav.Link
            as={NavLink}
            to="/svg-editor"
            className={`${location.pathname === '/svg-editor' ? 'active' : ''} d-flex align-items-center justify-content-center `}
            style={{
              height: '40px',
              width: '40px',
              opacity: isAuthenticated ? 1 : 0.6
            }}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
              }
            }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="svg-editor-tooltip">
                  svg editor
                </Tooltip>
                }
              >
                <span>vektoro</span>
              </OverlayTrigger>
            ) : (
              <span>vektoro</span>
            )}
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/drato"
            className={`${location.pathname === '/drato' ? 'active' : ''} d-flex align-items-center justify-content-center `}
            style={{
              height: '40px',
              width: '40px',
              opacity: isAuthenticated ? 1 : 0.6
            }}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
              }
            }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="drato-tooltip">
                  Bootstrap wireframing tool
                </Tooltip>
                }
              >
                <span>drato</span>
              </OverlayTrigger>
            ) : (
              <span>drato</span>
            )}
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/grafeo"
            className={`${location.pathname === '/grafeo' ? 'active' : ''} d-flex align-items-center justify-content-center `}
            style={{
              height: '40px',
              width: '40px',
              opacity: isAuthenticated ? 1 : 0.6
            }}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
              }
            }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="grafeo-tooltip">
                  GraphML editor
                </Tooltip>
                }
              >
                <span>grafeo</span>
              </OverlayTrigger>
            ) : (
              <span>grafeo</span>
            )}
          </Nav.Link>


          {/* Settings Link - Always accessible */}
          <Nav.Link
            as={NavLink}
            to="/settings"
            className={`${location.pathname === '/settings' ? 'active' : ''} d-flex align-items-center justify-content-center`}
            style={{ height: '40px', width: '40px' }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="settings-tooltip">
                    Settings
                  </Tooltip>
                }
              >
                <span>⚙️</span>
              </OverlayTrigger>
            ) : (
              <span>⚙️</span>
            )}
          </Nav.Link>

        </Nav>

        {/* WebSocket Status Indicator - Always show normal tooltip */}
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="status-tooltip">
              {isConnected ? 'Dev mode - Full access' : 'Static mode - Read only'}
            </Tooltip>
          }
        >
          <div className="p-2 border-top d-flex align-items-center justify-content-center">
            <span
              className={`badge rounded-circle d-flex align-items-center justify-content-center`}
              style={{
                backgroundColor: isConnected ? '#198754' : '#6c757d',
                width: '20px',
                height: '20px',
                fontSize: '12px'
              }}
            >
              {isConnected ? '🟢' : '🔴'}
            </span>
          </div>
        </OverlayTrigger>

        {/* Footer - Always show normal tooltip */}
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="footer-tooltip">
              made with ❤️ and <a href="https://www.npmjs.com/package/testeranto">testeranto</a>
            </Tooltip>
          }
        >
          <div className="p-3 border-top text-center mt-auto">
            <span className="text-muted">❤️</span>
          </div>
        </OverlayTrigger>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
        {/* Top Navigation Bar */}
        {/* <Navbar className="border-bottom">
          <Container fluid>
            <Navbar.Brand>{title || 'Testeranto'}</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <UserProfile />
            </Navbar.Collapse>
          </Container>
        </Navbar> */}

        <main className="flex-grow-1 p-4" style={{ overflow: 'auto' }}>
          <Container fluid style={{ height: '100%' }}>
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};
