/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import ReactDom from "react-dom/client";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { TestPage } from './components/stateful/TestPage';
import { Container } from 'react-bootstrap';
import { SettingsButton } from './SettingsButton';
import { ProjectPage } from './components/stateful/ProjectPage';
import { ProjectsPage } from './components/stateful/ProjectsPage';

export const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100" key={window.location.pathname}>
        <main className="flex-grow-1 p-3">
          <Container fluid>
            <Routes>
              <Route path="/" element={<ProjectsPage />} />
              <Route path="/projects/:projectName" element={<ProjectPage />} />
              <Route path="/projects/:projectName/tests/*" element={<TestPage />} />
              <Route path="/projects/:projectName#:tab" element={<ProjectPage />} />
            </Routes>
          </Container>
        </main>
        <footer className="bg-light py-3 d-flex justify-content-between align-items-center">
          <div className="ms-3">
            <SettingsButton />
          </div>
          <Container className="text-end" fluid={true}>
            made with ❤️ and <a href="https://www.npmjs.com/package/testeranto">testeranto</a>
          </Container>
        </footer>
      </div>
    </Router>
  );
};


// Export App to global scope
function initApp() {
  const rootElement = document.getElementById('root');
  if (rootElement && window.React && window.ReactDOM) {
    const root = window.ReactDOM.createRoot(rootElement);
    root.render(window.React.createElement(App));
  } else {
    // Retry if React isn't loaded yet
    setTimeout(initApp, 100);
  }
}

// Export App to global scope
if (typeof window !== 'undefined') {
  window.App = App;
  window.React = React;
  window.ReactDOM = ReactDom;
}
