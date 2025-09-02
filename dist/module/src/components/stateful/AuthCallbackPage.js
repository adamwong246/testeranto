import React, { useEffect } from 'react';
import { Spinner, Container } from 'react-bootstrap';
export const AuthCallbackPage = () => {
    useEffect(() => {
        // This page is only used in the popup window
        // The actual authentication handling is done via the message listener in App.tsx
        // This component just shows a loading spinner and will be closed automatically
    }, []);
    return (React.createElement(Container, { className: "d-flex justify-content-center align-items-center", style: { minHeight: '50vh' } },
        React.createElement("div", { className: "text-center" },
            React.createElement(Spinner, { animation: "border", role: "status", className: "mb-3" },
                React.createElement("span", { className: "visually-hidden" }, "Authenticating...")),
            React.createElement("h4", null, "Completing GitHub authentication..."))));
};
