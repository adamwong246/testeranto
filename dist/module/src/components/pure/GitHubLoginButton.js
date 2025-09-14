import React from 'react';
import { Button } from 'react-bootstrap';
import { githubAuthService } from '../../services/GitHubAuthService';
export const GitHubLoginButton = ({ className, variant = 'outline-dark', size, }) => {
    const handleLogin = () => {
        githubAuthService.initiateLogin();
    };
    return (React.createElement(Button, { className: className, variant: variant, size: size, onClick: handleLogin },
        React.createElement("i", { className: "bi bi-github me-2" }),
        "Sign in with GitHub"));
};
