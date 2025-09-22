import React from 'react';
import { Dropdown, Image, Nav } from 'react-bootstrap';
import { githubAuthService } from '../../services/GitHubAuthService';

export const UserProfile: React.FC = () => {
  const user = githubAuthService.userInfo;

  if (!githubAuthService.isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    githubAuthService.logout();
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="outline-light"
        id="user-profile-dropdown"
        className="d-flex align-items-center"
      >
        <Image
          src={user.avatar_url}
          roundedCircle
          width="32"
          height="32"
          className="me-2"
        />
        {user.login}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href={`https://github.com/${user.login}`} target="_blank">
          View on GitHub
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout}>
          Sign out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
