import React from 'react';
import { Card, CardBody } from 'react-bootstrap';
export const DebugEnv = () => {
    if (process.env.NODE_ENV === 'production') {
        return null;
    }
    const envInfo = {
        nodeEnv: process.env.NODE_ENV,
        clientId: process.env.GITHUB_CLIENT_ID,
        allProcessEnv: Object.keys(process.env)
            .filter(key => key.startsWith('REACT_APP_'))
            .reduce((obj, key) => {
            obj[key] = process.env[key];
            return obj;
        }, {}),
        windowEnv: typeof window !== 'undefined' ? window.env : 'window not defined',
        location: typeof window !== 'undefined' ? window.location : 'window not defined'
    };
    return (React.createElement(Card, { className: "mt-3" },
        React.createElement(CardBody, null,
            React.createElement("h6", null, "Environment Debug (Development Only)"),
            React.createElement("pre", null, JSON.stringify(envInfo, null, 2)))));
};
