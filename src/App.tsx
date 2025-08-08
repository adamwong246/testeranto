import React from 'react';
import ReactDom from "react-dom/client";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { TestPage } from './components/stateful/TestPage';
import { ProjectPage } from './components/stateful/ProjectPage';
import { ProjectsPage } from './components/stateful/ProjectsPage';
import { AppFrame } from './components/pure/AppFrame';
import { FeaturesReporter } from './components/stateful/FeaturesReporter';

export const App = () => {
  return (
    <Router>
      <AppFrame>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/projects/:projectName" element={<ProjectPage />} />
          <Route path="/projects/:projectName/tests/*" element={<TestPage />} />
          <Route path="/projects/:projectName#:tab" element={<ProjectPage />} />
          <Route path="/features-reporter" element={<FeaturesReporter />} />
        </Routes>
      </AppFrame>
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
