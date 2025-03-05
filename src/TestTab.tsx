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

  const [repos, setRepos] = useState<Record<string, string[]>>({});
  useEffect(() => {
    (async () => {
      fetch('http://localhost:8080/TaskMan.json')
        .then(response => response.json())
        .then(json => {
          setRepos(json.repos)
          // Promise.all(json.ids.map(async (_id) => {
          //   return {
          //     _id,
          //     ...await (await fetch(`http://localhost:8080/Kanban/${_id}.json`)).json()
          //   };
          // })).then((allKanbans: IKanban[]) => {

          //   setKanban(allKanbans)
          // })
        })
        .catch(error => console.error(error));

    })();
  }, []);

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
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">

            <Nav.Item>
              {
                ...Object.keys(repos).map((r) => {
                  return <NavLink
                    to={`/repos/${repos[r]}`}
                    className="nav-link"
                  >
                    {r}
                  </NavLink>
                })
              }
              {/* <NavLink
                to={`/commit/idk`}
                className="nav-link"
              >
                ChromaPDX/kokomoBay
              </NavLink> */}
            </Nav.Item>

            {/* {(gitTree.commits).map((c, ndx) =>
            <Nav.Item>
              <NavLink
                to={`/commit/${c.sha}`}
                className="nav-link"
              >
                {c.sha}
              </NavLink>
            </Nav.Item>
          )} */}
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            {
              testResults.map((t, ndx) =>
                <Nav.Item key={ndx} >
                  <Nav.Link eventKey={`test-${ndx}`} href={`#/${t.baseWithoutFiletype}`}  >
                    {t.baseWithoutFiletype}
                  </Nav.Link>
                </Nav.Item>
              )
            }

          </Tab.Content>
        </Col>

      </Row>


    </Tab.Container>

  </div>


};