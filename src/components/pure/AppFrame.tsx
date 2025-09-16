/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Container,
  Nav,
  OverlayTrigger,
  Tooltip,
  Navbar,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useWebSocket, useTutorialMode, useAuth } from "../../App";
import { UserProfile } from "./UserProfile";
import { HelpoChatDrawer } from "./HelpoChatDrawer";

type AppFrameProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
  title?: string;
  rightContent?: React.ReactNode;
};

export const AppFrame = ({ children, title, rightContent }: AppFrameProps) => {
  const location = useLocation();
  const { isConnected } = useWebSocket();
  const { tutorialMode } = useTutorialMode();
  const { isAuthenticated, logout } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHelpoActive, setIsHelpoActive] = useState(false);

  // Add CSS for the brand logo animation
  const brandLogoStyle = `
    .brand-logo:hover {
      transform: scale(1.1);
      transition: transform 0.3s ease;
    }
    .brand-logo:active {
      transform: scale(0.95);
    }
  `;

  useEffect(() => {
    // Only animate on the first load
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 4000); // Stop animation after all links have animated (1s + 1.8s = 2.8s, rounded up)
      return () => clearTimeout(timer);
    }
  }, [hasAnimated]);

  return (
    <div className="d-flex min-vh-100">
      <style>{brandLogoStyle}</style>
      {/* Sidebar - Always 60px wide, full height */}
      <div
        className={`border-end d-flex flex-column ${!hasAnimated ? 'sidebar-attention' : ''}`}
        style={{
          flexBasis: "100px" /* Sets the initial fixed width */,
          flexGrow: "0" /* Prevents the item from growing */,
          flexShrink: "0",

          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >

        {/* Navigation */}
        <Nav variant="pills" className="flex-column p-2 flex-grow-1">

          {/* Help Link - Always accessible */}
          <Nav.Link
            as={NavLink}
            to="/helpo"
            className={`${location.pathname === "/helpo" ? "active" : ""
              } d-flex align-items-center justify-content-center ${!hasAnimated ? 'navbar-attention-1' : ''}`}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="help-tooltip">Chat with Helpo, the helpful robot.</Tooltip>}
              >
                <span>helpo</span>
              </OverlayTrigger>
            ) : (
              <span>helpo</span>
            )}
          </Nav.Link>


          <Nav.Link
            as={NavLink}
            to="/flua"
            className={`${location.pathname === "/flua" ? "active" : ""
              } d-flex align-items-center justify-content-center ${!hasAnimated ? 'navbar-attention-1' : ''}`}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="help-tooltip">Process/Project Management</Tooltip>}
              >
                <span>flua</span>
              </OverlayTrigger>
            ) : (
              <span>flua</span>
            )}
          </Nav.Link>


          {/* Projects Link - Always clickable with hover, tutorial tooltip conditionally */}
          <Nav.Link
            as={NavLink}
            to="/projects"
            className={`${location.pathname === "/projects" ? "active" : ""
              } d-flex align-items-center justify-content-center ${!hasAnimated ? 'navbar-attention-2' : ''}`}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="projects-tooltip">Projects</Tooltip>}
              >
                <span>testo</span>
              </OverlayTrigger>
            ) : (
              <span>testo</span>
            )}
          </Nav.Link>

          {/* Process Manager Link - Darken if not authenticated or not connected */}
          <Nav.Link
            as={NavLink}
            to="/processes"
            className={`${location.pathname.startsWith('/processes') ? 'active' : ''} d-flex align-items-center justify-content-center ${!hasAnimated ? 'navbar-attention-3' : ''}`}
            // style={{
            //   height: '40px',
            //   width: '40px',
            //   opacity: isConnected && isAuthenticated ? 1 : 0.6
            // }}
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
                    Processes{" "}
                    {!isAuthenticated
                      ? "(Sign in required)"
                      : !isConnected
                        ? "(WebSocket disconnected)"
                        : ""}
                  </Tooltip>
                }
              >
                <span>proĉo</span>
              </OverlayTrigger>
            ) : (
              <span>proĉo</span>
            )}
          </Nav.Link>

          {/* Git Integration Link - Darken if not authenticated */}
          <Nav.Link
            as={NavLink}
            to="/git"
            className={`${location.pathname === "/git" ? "active" : ""
              } d-flex align-items-center justify-content-center ${!isAuthenticated ? "text-muted pe-none" : ""
              } ${!hasAnimated ? 'navbar-attention-4' : ''}`}
            // style={{
            //   height: '40px',
            //   width: '40px',
            //   opacity: isAuthenticated ? 1 : 0.6
            // }}
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
                    Git Integration{" "}
                    {!isAuthenticated ? "(Sign in required)" : ""}
                  </Tooltip>
                }
              >
                <span>arbo</span>
              </OverlayTrigger>
            ) : (
              <span>arbo</span>
            )}
          </Nav.Link>


          {/* <Nav.Link
            as={NavLink}
            to="/design-editor"
            className={`${location.pathname === '/design-editor' ? 'active' : ''} d-flex align-items-center justify-content-center`}
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
          </Nav.Link> */}


          <Nav.Link
            as={NavLink}
            to="/svg-editor"
            className={`${location.pathname === '/svg-editor' ? 'active' : ''} d-flex align-items-center justify-content-center`}
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
            className={`${location.pathname === '/drato' ? 'active' : ''} d-flex align-items-center justify-content-center`}
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
            className={`${location.pathname === '/grafeo' ? 'active' : ''} d-flex align-items-center justify-content-center`}
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

          <Nav.Link
            as={NavLink}
            to="/skribo"
            className={`${location.pathname === '/skribo' ? 'active' : ''} d-flex align-items-center justify-content-center`}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="skribo-tooltip">
                  Code editor
                </Tooltip>
                }
              >
                <span>skribo</span>
              </OverlayTrigger>
            ) : (
              <span>skribo</span>
            )}
          </Nav.Link>


          {/* Settings Link - Always accessible */}
          <Nav.Link
            as={NavLink}
            to="/settings"
            className={`${location.pathname === "/settings" ? "active" : ""
              } d-flex align-items-center justify-content-center ${!hasAnimated ? 'navbar-attention-6' : ''}`}
          // style={{ height: '40px', width: '40px' }}
          >
            {tutorialMode ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="settings-tooltip">Settings</Tooltip>}
              >
                <span>konto</span>
              </OverlayTrigger>
            ) : (
              <span>konto</span>
            )}
          </Nav.Link>
        </Nav>

        {/* WebSocket Status Indicator - Always show normal tooltip */}
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="status-tooltip">
              {isConnected
                ? "Dev mode - Full access"
                : "Static mode - Read only"}
            </Tooltip>
          }
        >
          <div className="p-2 border-top d-flex align-items-center justify-content-center">
            <span
              className={`badge rounded-circle d-flex align-items-center justify-content-center`}
            // style={{
            //   backgroundColor: isConnected ? '#198754' : '#6c757d',
            //   width: '20px',
            //   height: '20px',
            //   fontSize: '12px'
            // }}
            >
              {isConnected ? "🟢" : "🔴"}
            </span>
          </div>
        </OverlayTrigger>

        {/* Brand Logo */}
        <div className="p-2 border-top d-flex align-items-center justify-content-center">
          <button
            onClick={() => setIsHelpoActive(!isHelpoActive)}
            className="brand-logo btn p-0 border-0 bg-transparent"
            style={{
              display: 'block',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img
              src="https://www.testeranto.com/logo.svg"
              alt="Testeranto Logo"
              style={{
                height: '64px',
                width: '64px',
              }}
            />
          </button>
        </div>
      </div>

      {/* Helpo Drawer */}
      <HelpoChatDrawer
        isActive={isHelpoActive}
        onToggle={() => setIsHelpoActive(!isHelpoActive)}
      />

      {/* Main Content */}
      <div
        className="d-flex flex-column"
        style={{
          minHeight: "100vh",
          minWidth: "0", // Allows the content to shrink below its initial size
          flex: "1 1 auto", // Take up remaining space
          overflow: "auto", // Enable scrolling
        }}
      >
        <main className="flex-grow-1 p-4" style={{
          minWidth: "fit-content", // Allow the content to be as wide as needed
          width: "100%",
        }}>
          <Container fluid style={{
            height: "100%",
            minWidth: "fit-content", // Prevent the container from constraining width
          }}>
            {location.pathname === "/helpo" ? (
              <div>
                <h1>Helpo Documentation</h1>
                <p>Welcome to the Helpo documentation. Here you can find information about using Testeranto.</p>
                <h2>Getting Started</h2>
                <p>Start by creating a project and writing your first test cases.</p>
                <h2>Features</h2>
                <ul>
                  <li>Test automation</li>
                  <li>Process management</li>
                  <li>Git integration</li>
                  <li>And much more...</li>
                </ul>
              </div>
            ) : (
              children
            )}
          </Container>
        </main>
      </div>

    </div>
  );
};
