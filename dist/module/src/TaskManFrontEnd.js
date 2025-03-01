import { Container, Navbar } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import '@caldwell619/react-kanban/dist/styles.css';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@xyflow/react/dist/style.css';
import LoginButton from './LoginButton';
import { DocGal, ChatCat, ChatCatConversations, ChatCatPeople, DocGalDb, DocGalFs, OrgChart, Users, WhoThat, TaskMan } from './react';
import { TestTab } from './TestTab';
import { Kanban } from './TaskManKanBan';
import { Features } from './TaskManFeatures';
import { GanttChart } from './TaskManGantt';
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
    const [users, setUsers] = useState([]);
    const importUsers = async () => {
        fetch('http://localhost:8080/User.json')
            .then(response => response.json())
            .then(json => {
            Promise.all(json.ids.map(async (_id) => {
                return await (await fetch(`http://localhost:8080/User/${_id}.json`)).json();
            })).then((allUsers) => {
                console.log("allUsers", allUsers);
                setUsers(allUsers);
            });
        })
            .catch(error => console.error(error));
    };
    useEffect(() => { importUsers(); }, []);
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
            React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
                React.createElement(Container, { fluid: true },
                    React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                    React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                        React.createElement(Nav, { className: "me-auto" },
                            React.createElement(Tabs, { defaultActiveKey: "/tests" },
                                React.createElement(Tab, { eventKey: "tests", title: React.createElement(NavLink, { to: "/tests", className: "nav-link" }, "TestPup") }),
                                React.createElement(Tab, { eventKey: "taskMan", title: React.createElement(NavLink, { to: "/taskMan/features", className: "nav-link" }, "TaskMan") }),
                                React.createElement(Tab, { eventKey: "docGal", title: React.createElement(NavLink, { to: "/docGal/fs", className: "nav-link" }, "DocGal") }),
                                React.createElement(Tab, { eventKey: "chatCat", title: React.createElement(NavLink, { to: "/chatCat/mostRecent", className: "nav-link" }, "ChatCat") }),
                                React.createElement(Tab, { eventKey: "whoThat", title: React.createElement(NavLink, { to: "/whoThat/people", className: "nav-link" }, "WhoThat") })))),
                    React.createElement(LoginButton, null))),
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/tests", element: React.createElement(TestTab, { adminMode: adminMode, tasks: tasks, results: state.results, tests: tests, reposAndBranches: reposAndBranches, setRepo: setRepo, currentRepo: currentRepo, currentBranch: currentBranch }) }),
                React.createElement(Route, { path: "/tests/:id/log.txt", element: React.createElement(TestTab, { adminMode: adminMode, tasks: tasks, results: state.results, tests: tests, reposAndBranches: reposAndBranches, setRepo: setRepo, currentRepo: currentRepo, currentBranch: currentBranch }) }),
                React.createElement(Route, { path: "/chatCat/mostRecent", element: React.createElement(ChatCat, { chatCatRooms: chatCatRooms, chatCatHuddles: [], users: users },
                        React.createElement(ChatCatPeople, { users: users })) }),
                React.createElement(Route, { path: "/chatCat/bySubject", element: React.createElement(ChatCat, { chatCatRooms: chatCatRooms, chatCatHuddles: [], users: users },
                        React.createElement(ChatCatConversations, { users: users, conversations: [] })) }),
                React.createElement(Route, { path: "/docGal/fs", element: React.createElement(DocGal, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(DocGalFs, { docGalFs: docGalFs })) }),
                React.createElement(Route, { path: "/docGal/db", element: React.createElement(DocGal, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(DocGalDb, null)) }),
                React.createElement(Route, { path: "/taskMan/features", element: React.createElement(TaskMan, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(Features, { adminMode: adminMode, tests: tests })) }),
                React.createElement(Route, { path: "/taskMan/kanban", element: React.createElement(TaskMan, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(Kanban, { adminMode: adminMode, kanban: kanban, tests: tests, tasks: tasks, openNewColumnModal: () => {
                            } })) }),
                React.createElement(Route, { path: "/taskMan/gantt", element: React.createElement(TaskMan, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(GanttChart, { adminMode: adminMode, tasks: tasks, milestones: milestones, projects: projects, tests: tests })) }),
                React.createElement(Route, { path: "/whoThat/people", element: React.createElement(WhoThat, { users: users },
                        React.createElement(Users, { adminMode: adminMode, users: users })) }),
                React.createElement(Route, { path: "/whoThat/groups", element: React.createElement(WhoThat, { users: users },
                        React.createElement(Users, { adminMode: adminMode, users: users })) }),
                React.createElement(Route, { path: "/whoThat/org", element: React.createElement(WhoThat, { users: users },
                        React.createElement(OrgChart, { adminMode: adminMode, users: users })) }))),
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
