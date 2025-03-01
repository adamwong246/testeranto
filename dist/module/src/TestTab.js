import { Octokit } from 'octokit';
import { Container, Navbar, NavDropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { NavLink, useParams } from 'react-router-dom';
import '@caldwell619/react-kanban/dist/styles.css';
// import { Octokit } from "@octokit/rest";
const octokit = new Octokit({
    auth: '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'
});
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
        // const ts = await octokit.request('GET /repos/ChromaPDX/kokomoBay/git/trees/master', {
        //   owner: 'ChromaPDX',
        //   repo: 'kokomoBay',
        //   tree_sha: 'master',
        //   headers: {
        //     'X-GitHub-Api-Version': '2022-11-28'
        //   }
        // })
        // const ts = await octokit.request('GET /repos/ChromaPDX/kokomoBay/git/trees/e9999b64b8dcf2e589e5953fbb20e51521d97083?recursive=true', {
        //   owner: 'ChromaPDX',
        //   repo: 'kokomoBay',
        //   tree_sha: "e9999b64b8dcf2e589e5953fbb20e51521d97083",
        //   headers: {
        //     'X-GitHub-Api-Version': '2022-11-28'
        //   }
        // })
        console.log("tss", tss);
        setTestResults(tss);
        // fetch('http://localhost:8080/rooms.json')
        //   .then(response => response.json())
        //   .then(json => setChatCatRooms(json))
        //   .catch(error => console.error(error));
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
