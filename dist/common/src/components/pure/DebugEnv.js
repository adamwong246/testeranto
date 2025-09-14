"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugEnv = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const DebugEnv = () => {
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
    return (react_1.default.createElement(react_bootstrap_1.Card, { className: "mt-3" },
        react_1.default.createElement(react_bootstrap_1.CardBody, null,
            react_1.default.createElement("h6", null, "Environment Debug (Development Only)"),
            react_1.default.createElement("pre", null, JSON.stringify(envInfo, null, 2)))));
};
exports.DebugEnv = DebugEnv;
