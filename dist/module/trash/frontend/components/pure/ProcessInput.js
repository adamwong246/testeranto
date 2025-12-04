import React, { useRef, useCallback } from 'react';
export const ProcessInput = ({ inputValue, webSocketStatus, onInputChange, onKeyPress, onSubmit, }) => {
    const inputRef = useRef(null);
    const isConnected = webSocketStatus === 'connected';
    const handleButtonClick = useCallback((e) => {
        e.stopPropagation();
        onSubmit();
        // Focus the input using ref
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [onSubmit]);
    return (React.createElement("div", { className: "border-top bg-white p-3", style: { flexShrink: 0 } },
        React.createElement("div", { className: "input-group" },
            React.createElement("input", { ref: inputRef, type: "text", className: "form-control", placeholder: "Type input and press Enter...", value: inputValue, onChange: onInputChange, onKeyPress: onKeyPress, autoFocus: true, onClick: (e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                }, onFocus: (e) => {
                    e.target.select();
                }, style: { cursor: 'text' }, disabled: !isConnected }),
            React.createElement("button", { className: "btn btn-primary", type: "button", onClick: handleButtonClick, disabled: !isConnected || !inputValue.trim() }, "Send")),
        React.createElement("small", { className: "text-muted" },
            "\uD83D\uDCA1 Press Enter to send input to the process",
            !isConnected && ` (WebSocket is ${webSocketStatus})`)));
};
