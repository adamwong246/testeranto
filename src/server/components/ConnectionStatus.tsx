import React from 'react';
import { Badge } from 'react-bootstrap';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <Badge 
      bg={isConnected ? 'success' : 'danger'} 
      className="align-middle"
    >
      {isConnected ? 'Connected' : 'Disconnected'}
    </Badge>
  );
};
