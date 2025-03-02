import { Container, Navbar, NavDropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { NavLink, useParams } from 'react-router-dom';
import '@caldwell619/react-kanban/dist/styles.css';
import { octokit } from './DELETEME';
// import {
//   GetResponseTypeFromEndpointMethod,
//   GetResponseDataTypeFromEndpointMethod,
// } from "@octokit/types";
// import { Octokit } from "@octokit/rest";
export const TestTab = ({ tests, tasks, results, adminMode, setRepo, reposAndBranches, currentRepo }) => {
    const { id } = useParams();
    const [testResults, setTestResults] = useState([]);
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
            };
        });
        const tss = await Promise.all(ts);
        console.log("tss", tss);
        setTestResults(tss);
    };
    useEffect(() => { importTests(); }, []);
    return React.createElement("div", null,
        React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 4 },
                    React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
                        React.createElement(Container, { fluid: true },
                            React.createElement(NavDropdown, { align: "start", title: "Repo", id: "basic-nav-dropdown-repo", onSelect: (e) => {
                                    console.log(e);
                                    setRepo(e);
                                } }, ...Object.entries(reposAndBranches).map(([r, b]) => {
                                return (React.createElement(NavDropdown.Item, { href: "#action/3.4" }, r));
                            })),
                            React.createElement(NavDropdown, { align: "end", title: "Branch", id: "basic-nav-dropdown-branch" }, ...reposAndBranches[currentRepo].map((b) => {
                                return React.createElement(NavDropdown.Item, { href: "#action/3.4" }, b);
                            })))),
                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, testResults.map((t, ndx) => React.createElement(Nav.Item, { key: ndx },
                        React.createElement(Nav.Link, { eventKey: `test-${ndx}`, href: `#/${t.baseWithoutFiletype}` }, t.baseWithoutFiletype))))),
                React.createElement(Col, { sm: 8 },
                    React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
                        React.createElement(Container, { fluid: true },
                            React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                            React.createElement(Nav, { className: "me-auto" },
                                React.createElement(Tabs, { defaultActiveKey: "exitcode" },
                                    React.createElement(Tab, { eventKey: `tests-log.txt`, title: React.createElement(NavLink, { to: `tests-log.txt`, className: "nav-link" }, "log.tx") })))))))));
};
