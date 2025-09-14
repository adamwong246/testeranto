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
exports.TerminalInput = void 0;
const react_1 = __importStar(require("react"));
const TerminalInput = ({ onInput }) => {
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const inputRef = (0, react_1.useRef)(null);
    const handleSubmit = (0, react_1.useCallback)(() => {
        if (inputValue.trim()) {
            onInput(inputValue + '\n');
            setInputValue('');
        }
    }, [inputValue, onInput]);
    const handleKeyPress = (0, react_1.useCallback)((e) => {
        if (e.key === 'Enter') {
            handleSubmit();
            e.preventDefault();
        }
    }, [handleSubmit]);
    const handleInputChange = (0, react_1.useCallback)((e) => {
        setInputValue(e.target.value);
    }, []);
    // Focus the input after submission
    (0, react_1.useEffect)(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputValue]);
    // const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    //   e.stopPropagation();
    //   handleSubmit();
    // }, [handleSubmit]);
    return (react_1.default.createElement("div", { className: "border-top bg-white p-2 mt-2", style: { flexShrink: 0 } },
        react_1.default.createElement("div", { className: "input-group" },
            react_1.default.createElement("input", { ref: inputRef, type: "text", className: "form-control", placeholder: "Type input and press Enter...", value: inputValue, onChange: handleInputChange, onKeyPress: handleKeyPress, autoFocus: true, onClick: (e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                }, onFocus: (e) => {
                    e.target.select();
                }, style: { cursor: 'text' } }),
            react_1.default.createElement("button", { className: "btn btn-primary", type: "button", onClick: handleSubmit, disabled: !inputValue.trim() }, "Send"))));
};
exports.TerminalInput = TerminalInput;
