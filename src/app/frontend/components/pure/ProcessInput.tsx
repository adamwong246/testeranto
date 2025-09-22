import React, { useRef, useCallback } from 'react';

interface ProcessInputProps {
  inputValue: string;
  webSocketStatus: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export const ProcessInput: React.FC<ProcessInputProps> = ({
  inputValue,
  webSocketStatus,
  onInputChange,
  onKeyPress,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isConnected = webSocketStatus === 'connected';
  
  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSubmit();
    // Focus the input using ref
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onSubmit]);

  return (
    <div className="border-top bg-white p-3" style={{ flexShrink: 0 }}>
      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder="Type input and press Enter..."
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          autoFocus
          onClick={(e) => {
            e.stopPropagation();
            e.currentTarget.focus();
          }}
          onFocus={(e) => {
            e.target.select();
          }}
          style={{ cursor: 'text' }}
          disabled={!isConnected}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleButtonClick}
          disabled={!isConnected || !inputValue.trim()}
        >
          Send
        </button>
      </div>
      <small className="text-muted">
        💡 Press Enter to send input to the process
        {!isConnected && ` (WebSocket is ${webSocketStatus})`}
      </small>
    </div>
  );
};
