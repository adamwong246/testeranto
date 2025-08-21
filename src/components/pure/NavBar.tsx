import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Badge, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

type NavItem = {
  to?: string;
  label: string | React.ReactNode;
  active?: boolean;
  className?: string;
  badge?: {
    variant: string;
    text: string;
  };
  icon?: React.ReactNode;
};

type NavBarProps = {
  title: string;
  backLink?: string;
  navItems?: NavItem[];
  rightContent?: React.ReactNode;
  showProcessManagerLink?: boolean;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
};

export const NavBar: React.FC<NavBarProps> = ({
  title,
  backLink,
  navItems = [],
  rightContent,
}) => {
  const location = useLocation();

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="mb-2"
      sticky="top"
      expanded={false}
    >
      <Container fluid>
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
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ display: 'none' }} />
        
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
                    title={typeof item.label === 'string' ? item.label : undefined}
                  >
                    {item.icon && <span className="me-2">{item.icon}</span>}
                    {item.label}
                    {item.badge && (
                      <Badge
                        bg={item.badge.variant}
                        className="ms-2"
                      >
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
              {React.Children.map(rightContent, (child) => {
                return child;
              })}
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
