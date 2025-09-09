import React, { useState, useCallback, useRef, useEffect } from 'react';

interface TerminalInputProps {
  onInput: (data: string) => void;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ onInput }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      onInput(inputValue + '\n');
      setInputValue('');
    }
  }, [inputValue, onInput]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
      e.preventDefault();
    }
  }, [handleSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="border-top bg-white p-2 mt-2" style={{ flexShrink: 0 }}>
      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder="Type input and press Enter..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          autoFocus
          onClick={(e) => {
            e.stopPropagation();
            e.currentTarget.focus();
          }}
          onFocus={(e) => {
            e.target.select();
          }}
          style={{ cursor: 'text' }}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};
