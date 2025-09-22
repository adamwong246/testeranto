import React from 'react';
import { Button } from 'react-bootstrap';
import { githubAuthService } from '../../GitHubAuthService';


interface GitHubLoginButtonProps {
  className?: string;
  variant?: string;
  size?: 'sm' | 'lg';
}

export const GitHubLoginButton: React.FC<GitHubLoginButtonProps> = ({
  className,
  variant = 'outline-dark',
  size,
}) => {
  const handleLogin = () => {
    githubAuthService.initiateLogin();
  };

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={handleLogin}
    >
      <i className="bi bi-github me-2"></i>
      Sign in with GitHub
    </Button>
  );
};
