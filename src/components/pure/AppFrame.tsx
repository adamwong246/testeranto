/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Container, Nav, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useWebSocket } from '../../App';

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
  const [isExpanded, setIsExpanded] = useState(true);
  const { isConnected } = useWebSocket();

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <div
        className="bg-light border-end d-flex flex-column"
        style={{
          width: isExpanded ? '250px' : '60px',
          minHeight: '100vh',
          transition: 'width 0.3s ease'
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-3 border-bottom d-flex align-items-center justify-content-center">
          {isExpanded ? (
            <img
              src="/logo.svg"
              alt="Testeranto Logo"
              style={{ width: '128px', height: '128px' }}
            />
          ) : (
            <img
              src="/logo.svg"
              alt="Testeranto Logo"
              style={{ width: '40px', height: '40px' }}
            />
          )}
        </div>
        <Nav variant="pills" className="flex-column p-2 flex-grow-1">
          <Nav.Link
            as={NavLink}
            to="/"
            className={`${location.pathname === '/' ? 'active' : ''} text-truncate d-flex align-items-center`}
            style={{ width: '100%' }}
            title="Projects"
          >
            <span className="me-2">📁</span>
            {isExpanded && 'Projects'}
          </Nav.Link>

          {/* temporarily disabled */}
          {/* <Nav.Link
            as={NavLink}
            to="/features-reporter"
            className={`${location.pathname === '/features-reporter' ? 'active' : ''} text-truncate d-flex align-items-center`}
            style={{ width: '100%' }}
            title="Features Reporter"
          >
            <span className="me-2">📊</span>
            {isExpanded && 'Features Reporter'}
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/design-editor"
            className={`${location.pathname === '/design-editor' ? 'active' : ''} text-truncate d-flex align-items-center`}
            style={{ width: '100%' }}
            title="Design Editor"
          >
            <span className="me-2">🎨</span>
            {isExpanded && 'Design Editor'}
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/text-editor"
            className={`${location.pathname === '/text-editor' ? 'active' : ''} text-truncate d-flex align-items-center`}
            style={{ width: '100%' }}
            title="Text Editor"
          >
            <span className="me-2">📝</span>
            {isExpanded && 'Text Editor'}
          </Nav.Link> */}

          <Nav.Link
            as={NavLink}
            to="/processes"
            className={`${location.pathname.startsWith('/processes') ? 'active' : ''} text-truncate d-flex align-items-center ${!isConnected ? 'text-muted pe-none' : ''}`}
            style={{ width: '100%', opacity: isConnected ? 1 : 0.6 }}
            title={isConnected ? "Process Manager" : "Process Manager (WebSocket not connected)"}
            onClick={(e) => {
              if (!isConnected) {
                e.preventDefault();
              }
            }}
          >
            <span className="me-2">📊</span>
            {isExpanded && 'Process Manager'}
            {!isConnected && isExpanded && (
              <span className="ms-1">🔴</span>
            )}
          </Nav.Link>

          {/* <Nav.Link
            as={NavLink}
            to="/settings"
            className={`${location.pathname === '/settings' ? 'active' : ''} text-truncate d-flex align-items-center`}
            style={{ width: '100%' }}
            title="Settings"
          >
            <span className="me-2">⚙️</span>
            {isExpanded && 'Settings'}
          </Nav.Link> */}
        </Nav>

        {/* WebSocket Status Indicator */}
        <div className="p-2 border-top d-flex align-items-center justify-content-center">
          {isExpanded ? (
            <div className="d-flex align-items-center">
              <Badge bg={isConnected ? 'success' : 'secondary'} className="me-2">
                {isConnected ? '🟢' : '🔴'}
              </Badge>
              <small className="text-muted">
                {isConnected ? 'Dev mode' : 'Static mode'}
              </small>
            </div>
          ) : (
            <Badge bg={isConnected ? 'success' : 'secondary'}>
              {isConnected ? '🟢' : '🔴'}
            </Badge>
          )}
        </div>
        
        <div className="p-3 border-top text-center mt-auto">
          {isExpanded ? (
            <small className="text-muted">
              made with ❤️ and <a href="https://www.npmjs.com/package/testeranto">testeranto</a>
            </small>
          ) : (
            <small className="text-muted">❤️</small>
          )}
        </div>
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <main className="flex-grow-1 p-4" style={{ overflow: 'auto' }}>
          <Container fluid className="h-100">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};
