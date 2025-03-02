import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import '@caldwell619/react-kanban/dist/styles.css';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@xyflow/react/dist/style.css';
import { OrgChart } from './react';
import { TestTab } from './TestTab';
import { Kanban } from './TaskManKanBan';
import { Features } from './TaskManFeatures';
import { GanttChart } from './TaskManGantt';
import { ReactFlow } from "@xyflow/react";
const collectionEffect = (collection, setter, coercer = (x) => x) => {
    useEffect(() => {
        (async () => {
            fetch(`http://localhost:8080/${collection}.json`)
                .then(response => response.json())
                .then(json => {
                Promise.all(json.ids.map(async (_id) => {
                    return Object.assign({ _id }, coercer(await (await fetch(`http://localhost:8080/${collection}/${_id}.json`)).json()));
                })).then((items) => {
                    console.log("setting", collection, items);
                    setter(items);
                });
            })
                .catch(error => console.error(error));
        })();
    }, []);
};
const Report = () => {
    const [state, setState] = useState({
        tests: [],
        buildDir: "",
        results: {}
    });
    const [tests, setTests] = useState({
        tests: [],
        buildDir: ""
    });
    const [kanban, setKanban] = useState([]);
    const importResults = async () => {
        const config = await (await fetch("./testeranto.json")).json();
        const results = await Promise.all(config.tests.map((test) => {
            return new Promise(async (res, rej) => {
                const src = test[0];
                const runtime = test[1];
                const s = [tests.buildDir, runtime].concat(src.split(".").slice(0, -1).join(".")).join("/");
                const exitcode = await (await fetch("/docs" + "/" + s + "/exitcode")).text();
                const log = await (await fetch("/docs" + "/" + s + "/log.txt")).text();
                const testresults = await (await fetch("/docs" + "/" + s + "/tests.json")).json();
                const manifest = await (await fetch("/docs" + "/" + s + "/manifest.json")).json();
                res({ src, exitcode, log, testresults, manifest });
            });
        }));
        setState({ tests: config.tests, results, buildDir: config.buildDir });
    };
    ///////////////////////////////////////////
    const [tasks, setTasks] = useState([]);
    collectionEffect(`Task`, setTasks, (t) => {
        return Object.assign(Object.assign({}, t), { start: new Date(t.start), end: new Date(t.end) });
    });
    const [milestones, setMilestones] = useState([]);
    collectionEffect(`Milestone`, setMilestones, (m) => {
        return Object.assign(Object.assign({}, m), { start: new Date(m.date), end: new Date(m.date) });
    });
    const [projects, setProjects] = useState([]);
    collectionEffect(`Project`, setProjects);
    const [users, setUsers] = useState([]);
    collectionEffect(`User`, setUsers);
    // const importFeatures = ;
    // useEffect(() => {
    //   (async () => {
    //     fetch('http://localhost:8080/Task.json')
    //       .then(response => response.json())
    //       .then(json => {
    //         Promise.all(json.ids.map(async (_id) => {
    //           return {
    //             _id,
    //             ...await (await fetch(`http://localhost:8080/Task/${_id}.json`)).json()
    //           };
    //         })).then((allFeatures: ITask[]) => {
    //           setTasks(allFeatures)
    //         })
    //       })
    //       .catch(error => console.error(error));
    //   })(); }, []);
    ///////////////////////////////////////////
    const importKanban = async () => {
        fetch('http://localhost:8080/Kanban.json')
            .then(response => response.json())
            .then(json => {
            // setKanban(json)
            Promise.all(json.ids.map(async (_id) => {
                return Object.assign({ _id }, await (await fetch(`http://localhost:8080/Kanban/${_id}.json`)).json());
            })).then((allKanbans) => {
                console.log("allKanbans", allKanbans);
                setKanban(allKanbans);
            });
        })
            .catch(error => console.error(error));
    };
    useEffect(() => { importKanban(); }, []);
    // const importUsers = async () => {
    //   fetch('http://localhost:8080/User.json')
    //     .then(response => response.json())
    //     .then(json => {
    //       Promise.all(json.ids.map(async (_id) => {
    //         return await (await fetch(`http://localhost:8080/User/${_id}.json`)).json();
    //       })).then((allUsers: IUser[]) => {
    //         console.log("allUsers", allUsers)
    //         setUsers(allUsers)
    //       })
    //     })
    //     .catch(error => console.error(error));
    // };
    // useEffect(() => { importUsers(); }, []);
    // const [gantt, setGantt] = useState<IGantt[]>(
    //   []
    // );
    // const importGantt = async () => {
    //   fetch('http://localhost:8080/Gantt.json')
    //     .then(response => response.json())
    //     .then(json => {
    //       Promise.all(json.ids.map(async (_id) => {
    //         return await (await fetch(`http://localhost:8080/Gantt/${_id}.json`)).json();
    //       })).then((allGantts: IGantt[]) => {
    //         console.log("allGantts", allGantts)
    //         setGantt(allGantts)
    //       })
    //     })
    //     .catch(error => console.error(error));
    // };
    // useEffect(() => { importGantt(); }, []);
    const importTests = async () => {
        const x = await fetch("./testeranto.json");
        const y = await x.json();
        setTests(y);
    };
    useEffect(() => { importResults(); }, []);
    useEffect(() => { importTests(); }, []);
    const [activeKey, setActiveKey] = useState('home');
    const handleSelect = (selectedKey) => {
        setActiveKey(selectedKey);
    };
    const [adminMode, setAdminMode] = useState(false);
    const [docGalFs, setDocGalFs] = useState([]);
    const importFs = async () => {
        fetch('http://localhost:8080/docGal/fs.json')
            .then(response => response.json())
            .then(json => setDocGalFs(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importFs(); }, []);
    const [chatCatRooms, setChatCatRooms] = useState([]);
    const importChatCatRooms = async () => {
        fetch('http://localhost:8080/rooms.json')
            .then(response => response.json())
            .then(json => setChatCatRooms(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importChatCatRooms(); }, []);
    const reposAndBranches = {
        "ChromaPDX/kokomoBay": [
            "master"
        ]
    };
    const [currentRepo, setRepo] = useState("ChromaPDX/kokomoBay");
    const [currentBranch, setBranch] = useState("master");
    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    ];
    const initialEdges = [
        { id: 'e1-2', source: 'adam', target: 'marcus' }
    ];
    const orgNodes = [
        // ...initialNodes,
        ...users.map((user) => {
            return ({
                id: user._id, position: {
                    x: (Math.random() * 600) - 300,
                    y: (Math.random() * 600) - 300
                }, data: { label: user._id }
            });
        })
    ];
    console.log("orgNodes", orgNodes);
    return (React.createElement("div", null,
        React.createElement("style", null, `
pre, code, p {
  max-width: 40rem;
  text-wrap: auto;
}
footer {
  background-color: lightgray;
  margin: 0.5rem;
  padding: 0.5rem;
  position: fixed;
  bottom: 0;
  right: 0;
}

#root > div > ul {

  top: 0;
}
          `),
        React.createElement(Router, null,
            React.createElement(Tab.Container, { id: "left-tabs-example", defaultActiveKey: "first" },
                React.createElement(Row, null,
                    React.createElement(Col, { sm: 1 },
                        React.createElement(Nav, { variant: "pills", className: "flex-column" },
                            React.createElement(Nav.Item, null,
                                React.createElement(NavLink, { to: "/tests", className: "nav-link" }, "tests")),
                            React.createElement(Nav.Item, null,
                                React.createElement(NavLink, { to: "/features", className: "nav-link" }, "features")),
                            React.createElement(Nav.Item, null,
                                React.createElement(NavLink, { to: "/kanban", className: "nav-link" }, "kanban")),
                            React.createElement(Nav.Item, null,
                                React.createElement(NavLink, { to: "/gantt", className: "nav-link" }, "gantt")),
                            React.createElement(Nav.Item, null,
                                React.createElement(NavLink, { to: "/owners", className: "nav-link" }, "owners")),
                            React.createElement(Nav.Item, null,
                                React.createElement(NavLink, { to: "/org", className: "nav-link" }, "org")))),
                    React.createElement(Col, { sm: 11 },
                        React.createElement(Tab.Content, null,
                            React.createElement(Routes, null,
                                React.createElement(Route, { path: "/tests", element: React.createElement(TestTab, { adminMode: adminMode, tasks: tasks, results: state.results, tests: tests, reposAndBranches: reposAndBranches, setRepo: setRepo, currentRepo: currentRepo, currentBranch: currentBranch }) }),
                                React.createElement(Route, { path: "/tests/:id/log.txt", element: React.createElement(TestTab, { adminMode: adminMode, tasks: tasks, results: state.results, tests: tests, reposAndBranches: reposAndBranches, setRepo: setRepo, currentRepo: currentRepo, currentBranch: currentBranch }) }),
                                React.createElement(Route, { path: "/features", element: React.createElement(Features, { adminMode: adminMode, tests: tests }) }),
                                React.createElement(Route, { path: "/kanban", element: React.createElement(Kanban, { adminMode: adminMode, kanban: kanban, tests: tests, tasks: tasks, openNewColumnModal: () => {
                                        } }) }),
                                React.createElement(Route, { path: "/gantt", element: React.createElement(GanttChart, { adminMode: adminMode, tasks: tasks, milestones: milestones, projects: projects, tests: tests }) }),
                                React.createElement(Route, { path: "/owners", element: 
                                    // <OrgChart adminMode={adminMode} users={users} />
                                    React.createElement("div", { style: { width: '100vw', height: '100vh' } },
                                        React.createElement(ReactFlow, { nodes: orgNodes, edges: initialEdges })) }),
                                React.createElement(Route, { path: "/org", element: React.createElement(OrgChart, { adminMode: adminMode, users: users }) }))))))),
        React.createElement("footer", null,
            "made with \u2764\uFE0F and ",
            React.createElement("a", { href: "https://adamwong246.github.io/testeranto/" }, "testeranto "))));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(Report, {}));
    }
});
