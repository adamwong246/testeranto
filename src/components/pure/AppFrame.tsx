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
            to="/"
            className={`${location.pathname === "/" ? "active" : ""
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

          {/* Settings Link - Always accessible */}
          <Nav.Link
            as={NavLink}
            to="/settings"
            className={`${location.pathname === "/settings" ? "active" : ""
              } d-flex align-items-center justify-content-center ${!hasAnimated ? 'navbar-attention-5' : ''}`}
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

        {/* <p>made with ❤️ and <a href="https://www.npmjs.com/package/testeranto">testeranto</a></p> */}
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
        {/* Top Navigation Bar */}
        {/* <Navbar className="border-bottom">
          <Container fluid>
            <Navbar.Brand>{title || 'Testeranto'}</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <UserProfile />
            </Navbar.Collapse>
          </Container>
        </Navbar> */}

        <main className="flex-grow-1 p-4" style={{ overflow: "auto" }}>
          <Container fluid style={{ height: "100%" }}>
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};
