import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { githubAuthService } from '../../services/GitHubAuthService';
import { GitHubLoginButton } from './GitHubLoginButton';
export const SignIn = () => {
    return (React.createElement(Container, { className: "d-flex align-items-center justify-content-center min-vh-100" },
        React.createElement(Row, null,
            React.createElement(Col, { md: 12 },
                React.createElement(Card, null,
                    React.createElement(Card.Header, { className: "text-center" },
                        React.createElement("h3", { className: "mb-0" }, "Sign In")),
                    React.createElement(Card.Body, { className: "text-center" }, githubAuthService.isConfigured() ? (React.createElement(GitHubLoginButton, null)) : (React.createElement("div", null,
                        React.createElement("p", { className: "text-danger" }, "GitHub authentication is not configured"),
                        React.createElement("p", null, "Please contact the administrator")))))))));
};
