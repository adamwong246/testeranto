import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectsPage } from './ProjectsPage';
import { ProjectPage } from './ProjectPage';
import { TestPage } from './TestPage';
import { BuildLogsPage } from './BuildLogsPage';
import { Footer } from './Footer';
import { Navbar, Nav, Container, Alert } from 'react-bootstrap';

export const ReportApp = () => {
  const [projects, setProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/testeranto/reports/config.json');
        const config = await res.json();
        // Create project summaries from config
        const projectSummaries = config.tests.map(test => ({
          name: test[0].split('/')[2], // Extract project name
          testCount: 1, // Each test entry represents one test
          nodeStatus: test[1] === 'node' ? 'success' : 'unknown',
          webStatus: test[1] === 'web' ? 'success' : 'unknown',
          pureStatus: test[1] === 'pure' ? 'success' : 'unknown'
        }));
        setProjects(projectSummaries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">Testeranto Report</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/testeranto/projects.html">Projects</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <main className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/reports/:projectName" element={<ProjectPage />} />
            <Route path="/reports/:projectName/tests/:testName" element={<TestPage />} />
            <Route path="/reports/:projectName/builds/:runtime" element={<BuildLogsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

// Helper components would go here:
// - ProjectOverview (similar to Project.tsx main view)
// - ProjectDetail (shows all tests for a project)  
// - TestReport (similar to TestReport.tsx but for a specific test)
// - RuntimeStatus (shows build status for a runtime)
// - ErrorBoundary (handles errors in child components)

export default ReportApp;


document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(ReportApp, {}));
  }
});
