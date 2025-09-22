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
exports.ProcessInput = void 0;
const react_1 = __importStar(require("react"));
const ProcessInput = ({ inputValue, webSocketStatus, onInputChange, onKeyPress, onSubmit, }) => {
    const inputRef = (0, react_1.useRef)(null);
    const isConnected = webSocketStatus === 'connected';
    const handleButtonClick = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
        onSubmit();
        // Focus the input using ref
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [onSubmit]);
    return (react_1.default.createElement("div", { className: "border-top bg-white p-3", style: { flexShrink: 0 } },
        react_1.default.createElement("div", { className: "input-group" },
            react_1.default.createElement("input", { ref: inputRef, type: "text", className: "form-control", placeholder: "Type input and press Enter...", value: inputValue, onChange: onInputChange, onKeyPress: onKeyPress, autoFocus: true, onClick: (e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                }, onFocus: (e) => {
                    e.target.select();
                }, style: { cursor: 'text' }, disabled: !isConnected }),
            react_1.default.createElement("button", { className: "btn btn-primary", type: "button", onClick: handleButtonClick, disabled: !isConnected || !inputValue.trim() }, "Send")),
        react_1.default.createElement("small", { className: "text-muted" },
            "\uD83D\uDCA1 Press Enter to send input to the process",
            !isConnected && ` (WebSocket is ${webSocketStatus})`)));
};
exports.ProcessInput = ProcessInput;
