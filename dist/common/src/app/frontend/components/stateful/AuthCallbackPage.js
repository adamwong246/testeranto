"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCallbackPage = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const AuthCallbackPage = () => {
    (0, react_1.useEffect)(() => {
        // This page is only used in the popup window
        // The actual authentication handling is done via the message listener in App.tsx
        // This component just shows a loading spinner and will be closed automatically
    }, []);
    return (react_1.default.createElement(react_bootstrap_1.Container, { className: "d-flex justify-content-center align-items-center", style: { minHeight: '50vh' } },
        react_1.default.createElement("div", { className: "text-center" },
            react_1.default.createElement(react_bootstrap_1.Spinner, { animation: "border", role: "status", className: "mb-3" },
                react_1.default.createElement("span", { className: "visually-hidden" }, "Authenticating...")),
            react_1.default.createElement("h4", null, "Completing GitHub authentication..."))));
};
exports.AuthCallbackPage = AuthCallbackPage;
