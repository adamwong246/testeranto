import React from 'react';
import { Container } from 'react-bootstrap';
import { SettingsButton } from './SettingsButton';

type AppFrameProps = {
  children: React.ReactNode;
};

export const AppFrame = ({ children }: AppFrameProps) => {
  return (
    <div className="d-flex flex-column min-vh-100" key={window.location.pathname}>

      <main className="flex-grow-1 p-3">
        <Container fluid>
          {children}
        </Container>
      </main>
      <footer className="bg-light py-2 d-flex justify-content-between align-items-center">
        <SettingsButton />
        <Container className="text-end" fluid={true}>
          made with ❤️ and <a href="https://www.npmjs.com/package/testeranto">testeranto</a>
        </Container>
      </footer>
    </div>
  );
};
