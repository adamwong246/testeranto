import React from 'react';
import { Dropdown, Image } from 'react-bootstrap';
import { githubAuthService } from '../../services/GitHubAuthService';
export const UserProfile = () => {
    const user = githubAuthService.userInfo;
    if (!githubAuthService.isAuthenticated || !user) {
        return null;
    }
    const handleLogout = () => {
        githubAuthService.logout();
    };
    return (React.createElement(Dropdown, { align: "end" },
        React.createElement(Dropdown.Toggle, { variant: "outline-light", id: "user-profile-dropdown", className: "d-flex align-items-center" },
            React.createElement(Image, { src: user.avatar_url, roundedCircle: true, width: "32", height: "32", className: "me-2" }),
            user.login),
        React.createElement(Dropdown.Menu, null,
            React.createElement(Dropdown.Item, { href: `https://github.com/${user.login}`, target: "_blank" }, "View on GitHub"),
            React.createElement(Dropdown.Divider, null),
            React.createElement(Dropdown.Item, { onClick: handleLogout }, "Sign out"))));
};
