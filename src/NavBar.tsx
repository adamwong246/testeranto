import React from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type NavItem = {
  to?: string;
  label: string | React.ReactNode;
  active?: boolean;
  className?: string;
  badge?: {
    variant: string;
    text: string;
  };
};

type NavBarProps = {
  title: string;
  backLink?: string;
  navItems?: NavItem[];
  rightContent?: React.ReactNode;
};

export const NavBar: React.FC<NavBarProps> = ({
  title,
  backLink,
  navItems = [],
  rightContent
}) => {
  return (
    <Navbar bg="light" expand="lg" className="mb-4" sticky="top">
      <Container fluid={true}>
        {backLink && (
          <Nav.Link
            as={Link}
            to={backLink}
            className="me-2 fs-3 text-primary"
            style={{
              padding: '0.25rem 0.75rem',
              border: '2px solid var(--bs-primary)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem'
            }}
            title="Go up one level"
          >
            ↑
          </Nav.Link>
        )}
        <Navbar.Brand className={backLink ? 'ms-2' : ''}>
          {title}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {navItems.length > 0 && (
            <Nav className="me-auto">
              {navItems.map((item, i) => {
                const className = [
                  item.className,
                  item.active ? 'text-primary fw-bold border-bottom border-2 border-primary' : '',
                  typeof item.label === 'string' && item.label.includes('❌') ? 'text-danger fw-bold' : '',
                  typeof item.label === 'string' && item.label.includes('✅') ? 'text-success fw-bold' : '',
                  !item.active && typeof item.label !== 'string' ? 'text-secondary' : ''
                ].filter(Boolean).join(' ');

                return (
                  <Nav.Link
                    key={i}
                    as={item.to ? Link : 'div'}
                    to={item.to}
                    active={item.active}
                    className={className}
                    style={{
                      ':hover': {
                        color: 'var(--bs-primary)',
                        textDecoration: 'none'
                      }
                    }}
                  >
                    {item.label}
                    {item.badge && (
                      <Badge bg={item.badge.variant} className="ms-2">
                        {item.badge.text}
                      </Badge>
                    )}
                  </Nav.Link>
                );
              })}
            </Nav>
          )}
          {rightContent && (
            <Nav>
              {rightContent}
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
