import React, { useState, useCallback, useRef, useEffect } from 'react';
export const TerminalInput = ({ onInput }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const handleSubmit = useCallback(() => {
        if (inputValue.trim()) {
            onInput(inputValue + '\n');
            setInputValue('');
        }
    }, [inputValue, onInput]);
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSubmit();
            e.preventDefault();
        }
    }, [handleSubmit]);
    const handleInputChange = useCallback((e) => {
        setInputValue(e.target.value);
    }, []);
    // Focus the input after submission
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputValue]);
    // const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    //   e.stopPropagation();
    //   handleSubmit();
    // }, [handleSubmit]);
    return (React.createElement("div", { className: "border-top bg-white p-2 mt-2", style: { flexShrink: 0 } },
        React.createElement("div", { className: "input-group" },
            React.createElement("input", { ref: inputRef, type: "text", className: "form-control", placeholder: "Type input and press Enter...", value: inputValue, onChange: handleInputChange, onKeyPress: handleKeyPress, autoFocus: true, onClick: (e) => {
                    e.stopPropagation();
                    e.currentTarget.focus();
                }, onFocus: (e) => {
                    e.target.select();
                }, style: { cursor: 'text' } }),
            React.createElement("button", { className: "btn btn-primary", type: "button", onClick: handleSubmit, disabled: !inputValue.trim() }, "Send"))));
};
