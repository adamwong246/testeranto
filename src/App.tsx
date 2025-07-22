import ReactDom from "react-dom/client";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProjectsPage } from './ProjectsPage';
import { ProjectPage } from './ProjectPage';
import { TestPage } from './TestPage';
import { BuildLogsPage } from './BuildLogsPage';
import { Footer } from './Footer';
import { ISummary, IBuiltConfig } from './Types';

export const App = () => {
  const location = useLocation();

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Testeranto
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Projects
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/projects/:projectName" element={<ProjectPage />} />
            <Route
              path="/projects/:projectName/tests/:testName"
              element={<TestPage />}
            />
            <Route
              path="/projects/:projectName/builds/:runtime"
              element={<BuildLogsPage />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(App, {}));
  }
});
