import { Octokit } from 'octokit';
import { Button, ButtonGroup, Container, Dropdown, DropdownButton, Form, Navbar, NavDropdown, Table, ToggleButton } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BrowserRouter as Router, Route, NavLink, Routes, useParams } from 'react-router-dom';
import { UncontrolledBoard, KanbanBoard } from '@caldwell619/react-kanban'
import '@caldwell619/react-kanban/dist/styles.css'
import { octokit } from './DELETEME';

// import {
//   GetResponseTypeFromEndpointMethod,
//   GetResponseDataTypeFromEndpointMethod,
// } from "@octokit/types";
// import { Octokit } from "@octokit/rest";



export const TestTab = ({
  tests,
  tasks,
  results,
  adminMode,
  setRepo,
  reposAndBranches,
  currentRepo }: {
    tasks: any;
    results: any[];
    tests: { tests: any[]; buildDir: string; },
    // features: any[];
    adminMode: boolean;
    currentRepo: string;
    currentBranch: string;
    setRepo: (string) => void;
    reposAndBranches: Record<string, string[]>
  }) => {

  const { id } = useParams();

  const [testResults, setTestResults] = useState<{
    baseWithoutFiletype: string,
    content: string;
  }[]>([]);

  const importTests = async () => {
    const testsManifest = JSON.parse(atob((await octokit.request('GET /repos/ChromaPDX/kokomoBay/contents/docs/testeranto.json', {
      owner: 'ChromaPDX',
      repo: 'kokomoBay',
      path: 'docs/testeranto.json',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })).data.content)).tests;

    console.log("testsManifest", testsManifest);

    const ts = testsManifest.map(async ([base, runTime]) => {

      const baseWithoutFiletype = base.split(".").slice(0, -1).join(".");
      const content = atob((await octokit.request(`GET /repos/ChromaPDX/kokomoBay/contents/docs/${runTime}/${baseWithoutFiletype}/log.txt`, {
        owner: 'ChromaPDX',
        repo: 'kokomoBay',
        path: `docs/${runTime}/${baseWithoutFiletype}/log.txt`,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })).data.content);

      // return atob(content)
      return {
        baseWithoutFiletype, content
      }
    });

    const tss = await Promise.all(ts);

    console.log("tss", tss);
    setTestResults(tss);
  };
  useEffect(() => { importTests(); }, []);

  return <div>


    <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">

      <Row>
        <Col sm={4}>

          <Navbar expand="md" className="bg-body-tertiary">
            <Container fluid>

              <NavDropdown align="start" title="Repo" id="basic-nav-dropdown-repo" onSelect={(e) => {
                console.log(e);
                setRepo(e)
              }}>

                {
                  ...Object.entries(reposAndBranches).map(([r, b]) => {
                    return (<NavDropdown.Item href="#action/3.4">
                      {r}
                    </NavDropdown.Item>)
                  })
                }

              </NavDropdown>

              <NavDropdown align="end" title="Branch" id="basic-nav-dropdown-branch">

                {
                  ...reposAndBranches[currentRepo].map((b) => {
                    return <NavDropdown.Item href="#action/3.4">
                      {b}
                    </NavDropdown.Item>
                  })
                }

              </NavDropdown>

            </Container>
          </Navbar>

          <Nav variant="pills" className="flex-column">
            {
              testResults.map((t, ndx) =>
                <Nav.Item key={ndx} >
                  <Nav.Link eventKey={`test-${ndx}`} href={`#/${t.baseWithoutFiletype}`}  >
                    {t.baseWithoutFiletype}
                  </Nav.Link>
                </Nav.Item>
              )
            }
          </Nav>
        </Col>

        {/* <Col sm={1}>
          EXIT CODE HERE
        </Col> */}

        <Col sm={8}>


          <Navbar expand="md" className="bg-body-tertiary">
            <Container fluid>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />

              <Nav className="me-auto">
                < Tabs defaultActiveKey="exitcode" >

                  <Tab eventKey={`tests-log.txt`} title={
                    <NavLink to={`tests-log.txt`} className="nav-link">log.tx</NavLink>}></Tab>

                  {/* <Tab eventKey="exitcode" title={
                    <NavLink to="/tests" className="nav-link">exitcode</NavLink>}></Tab>
                  
                  <Tab eventKey="tests.json" title={
                    <NavLink to="/tests/fs" className="nav-link">tests.json</NavLink>}></Tab> */}
                </Tabs>

              </Nav>

            </Container>
          </Navbar>


        </Col>


      </Row>
    </Tab.Container>

  </div>


};