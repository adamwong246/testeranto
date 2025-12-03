import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export const SettingsButton: React.FC = () => {
  return (
    <Nav.Link as={NavLink} to="/settings">
      Settings
    </Nav.Link>
  );
};
