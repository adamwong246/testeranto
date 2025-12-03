import React, { useEffect } from 'react';
import { Spinner, Container } from 'react-bootstrap';

export const AuthCallbackPage: React.FC = () => {
  useEffect(() => {
    // This page is only used in the popup window
    // The actual authentication handling is done via the message listener in App.tsx
    // This component just shows a loading spinner and will be closed automatically
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Authenticating...</span>
        </Spinner>
        <h4>Completing GitHub authentication...</h4>
      </div>
    </Container>
  );
};
