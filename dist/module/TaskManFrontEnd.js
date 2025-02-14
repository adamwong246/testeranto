import { Button, ButtonGroup, Container, Form, Navbar, NavDropdown, Table, ToggleButton } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import { UncontrolledBoard } from '@caldwell619/react-kanban';
import '@caldwell619/react-kanban/dist/styles.css';
import { Gantt } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { featuresSchema, ganttSchema, kanbanSchema, userSchema } from "./mongooseSchemas";
const InputElementString = ({ tree, name }) => {
    console.log("mark string", tree);
    // return <Form.Control type="email" placeholder={name} />
    return React.createElement(Form.Group, { className: "mb-3", controlId: name },
        React.createElement(Form.Label, null, name),
        React.createElement(Form.Control, { placeholder: name }));
};
const InputElementArray = ({ tree, name }) => {
    console.log("mark5", tree);
    return React.createElement(Form.Control, { type: "email", placeholder: "Enter email" });
};
const InputElementObject = ({ tree, name }) => {
    // const x = schema.path(path);
    console.log("mark4", tree, tree.properties);
    return React.createElement("div", null, ...Object.keys(tree.properties).map((name) => {
        console.log("mark6", name, tree.properties[name].type);
        if (tree.properties[name].type === "object") {
            return React.createElement(InputElementObject, { tree: tree.properties[name], name: name });
        }
        if (tree.properties[name].type === "string") {
            return React.createElement(InputElementString, { tree: tree.properties[name], name: name });
        }
        if (Array.isArray(tree.properties[name].type)) {
            return React.createElement(InputElementArray, { tree: tree.properties[name], name: name });
        }
    }));
    // // if (tree.type === "string") {
    // //   return <InputElementString tree={tree.properties[path]} path={path}></InputElementString >
    // // }
    // return <div>IDK</div>
    // return <Form.Group>
    //   {/* {
    //       schema.get(path)
    //     } */}
    // </Form.Group>
};
const InputForm = ({ schema, path }) => {
    return React.createElement(Form.Group, null,
        React.createElement(InputElementObject, { tree: schema.toJSONSchema() }));
};
const Crud2 = ({ collection, collectionName, schema }) => {
    return React.createElement("div", null,
        React.createElement(Table, { striped: true, bordered: true, hover: true },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "id"),
                    React.createElement("th", null))),
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", null, "add new record"),
                    React.createElement("td", null,
                        React.createElement(Form, null,
                            React.createElement(InputForm, { schema: schema }),
                            React.createElement(Button, { variant: "primary", type: "submit" }, "Submit")))),
                collection.map((doc) => {
                    return React.createElement("tr", null,
                        React.createElement("td", null, doc._id),
                        React.createElement("td", null, JSON.stringify(doc, null, 2)));
                }))));
};
const Features = ({ features, tests, results, adminMode }) => {
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 4 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, (features).map((feature, ndx) => React.createElement(Nav.Item, { key: ndx },
                        React.createElement(Nav.Link, { eventKey: `feature/${feature._id}` }, feature.title))))),
                React.createElement(Col, { sm: 8 },
                    React.createElement(Tab.Content, null, (features).map((feature, ndx) => {
                        // const feature = features[featureKey];
                        return (React.createElement(Tab.Pane, { eventKey: `feature/${feature._id}`, key: ndx },
                            React.createElement("pre", null, JSON.stringify(feature, null, 2)),
                            React.createElement("ol", null, results.filter((result) => {
                                console.log("mark1", (result.testresults.src));
                                // return test._id === feature._id
                                // (result.testresults.givens.features || []).includes(feature._id)
                                // console.log("ark3", new Set(result.testresults.givens.reduce((mm: string[], el) => {
                                //   mm = mm.concat(el.features)
                                //   // console.log("mark2", el);
                                //   // el.features.forEach((feature) => {
                                //   //   mm.add(feature)
                                //   // });
                                //   return mm;
                                // }, [])));
                                return new Set(result.testresults.givens.reduce((mm, el) => {
                                    mm = mm.concat(el.features);
                                    // console.log("mark2", el);
                                    // el.features.forEach((feature) => {
                                    //   mm.add(feature)
                                    // });
                                    return mm;
                                }, [])).has(feature._id);
                            }).map((result) => {
                                return React.createElement("li", null, result.src);
                            }))));
                    })))));
    return React.createElement(Crud2, { schema: featuresSchema, collectionName: "features", collection: features });
};
const Tests = ({ tests, results, features, adminMode }) => {
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 4 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, tests.tests.map((t, ndx) => React.createElement(Nav.Item, { key: ndx },
                        React.createElement(Nav.Link, { eventKey: `test-${ndx}` },
                            t[0],
                            " - ",
                            t[1]))))),
                React.createElement(Col, { sm: 4 },
                    React.createElement(Tab.Content, null, tests.tests.map((t, ndx) => React.createElement(Tab.Pane, { eventKey: `test-${ndx}` },
                        React.createElement("pre", null, JSON.stringify(Object.entries(results).filter(([k, v]) => {
                            console.log(v.src, tests.tests[ndx][0]);
                            return v.src === tests.tests[ndx][0];
                        }), null, 2))))))));
    // return <Crud collectionName="features" collection={features}></Crud>
    return React.createElement("div", null);
};
const TaskMan = ({ setAdminMode, users, adminMode, children }) => {
    return React.createElement("div", null,
        React.createElement("div", { className: "row" },
            React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
                React.createElement(Container, { fluid: true },
                    React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                    React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                        React.createElement(Nav, { className: "me-auto" },
                            React.createElement(Tabs, { defaultActiveKey: "/tests" },
                                React.createElement(Tab, { eventKey: "features", title: React.createElement(NavLink, { to: "/taskMan/features", className: "nav-link" }, "Features") }),
                                React.createElement(Tab, { eventKey: "kanban", title: React.createElement(NavLink, { to: "/taskMan/kanban", className: "nav-link" }, "Kanban") }),
                                React.createElement(Tab, { eventKey: "gantt", title: React.createElement(NavLink, { to: "/taskMan/gantt", className: "nav-link" }, "Gantt") }),
                                React.createElement(Tab, { eventKey: "users", title: React.createElement(NavLink, { to: "/taskMan/users", className: "nav-link" }, "Users") }))),
                        React.createElement(NavDropdown, { align: "end", title: "User", id: "basic-nav-dropdown" },
                            users.map((user) => {
                                return React.createElement(NavDropdown.Item, { href: "#action/3.1" }, user.email);
                            }),
                            React.createElement(NavDropdown.Divider, null),
                            React.createElement(NavDropdown.Item, { href: "#action/3.4" }, "all")),
                        React.createElement(ButtonGroup, { className: "mb-2" },
                            React.createElement(ToggleButton, { id: "toggle-check", type: "checkbox", variant: "outline-primary", checked: adminMode, value: "1", onChange: (e) => setAdminMode(!adminMode) }, "\u2699\uFE0F")))))),
        children);
};
const DocGal = ({ setAdminMode, users, adminMode, children }) => {
    return React.createElement("div", null,
        React.createElement("div", { className: "row" },
            React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
                React.createElement(Container, { fluid: true },
                    React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                    React.createElement(Navbar.Collapse, { id: "docGal-navbar-nav" },
                        React.createElement(Nav, { className: "me-auto" },
                            React.createElement(Tabs, { defaultActiveKey: "/fs" },
                                React.createElement(Tab, { eventKey: "fs", title: React.createElement(NavLink, { to: "/docGal/fs", className: "nav-link" }, "FS") }),
                                React.createElement(Tab, { eventKey: "db", title: React.createElement(NavLink, { to: "/docGal/db", className: "nav-link" }, "DB") }))))))),
        children);
};
const ChatCat = ({ children }) => {
    return React.createElement("div", null,
        React.createElement("div", { className: "row" },
            React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
                React.createElement(Container, { fluid: true },
                    React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                    React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                        React.createElement(Nav, { className: "me-auto" },
                            React.createElement(Tabs, { defaultActiveKey: "/chatCat/users" },
                                React.createElement(Tab, { eventKey: "/chatCat/people", title: React.createElement(NavLink, { to: "/chatCat/people", className: "nav-link" }, "People") }),
                                React.createElement(Tab, { eventKey: "/chatCat/conversations", title: React.createElement(NavLink, { to: "/chatCat/conversations", className: "nav-link" }, "Conversations") }),
                                React.createElement(Tab, { eventKey: "/chatCat/rooms", title: React.createElement(NavLink, { to: "/chatCat/rooms", className: "nav-link" }, "Rooms") }))))))),
        children);
    // return <div>
    //   <Row>
    //     <Col sm={2}>
    //       <Nav variant="pills" className="flex-column">
    //         <h4>Rooms</h4>
    //         {(chatCatRooms).map((room, ndx) => <Nav.Item key={ndx}>
    //           <Nav.Link eventKey={`chatCat/room/${room._id}`}>
    //             {room.name}
    //           </Nav.Link>
    //         </Nav.Item>)}
    //         <h4>Huddles</h4>
    //         {(chatCatHuddles).map((huddle, ndx) => <Nav.Item key={ndx}>
    //           <Nav.Link eventKey={`chatCat/user${huddle._id}`}>
    //             {huddle.name}
    //           </Nav.Link>
    //         </Nav.Item>)}
    //         <h4>Users</h4>
    //         {(users).map((user, ndx) => <Nav.Item key={ndx}>
    //           <Nav.Link eventKey={`chatCat/user/${user._id}`}>
    //             {user.email}
    //           </Nav.Link>
    //         </Nav.Item>)}
    //       </Nav>
    //     </Col>
    //     <Col sm={10}>
    //       <Tab.Content>
    //         {(chatCatRooms).map((channel, ndx) => {
    //           return (
    //             <Tab.Pane eventKey={`chatCat/${channel}`} key={ndx}>
    //               <pre>{JSON.stringify(channel, null, 2)}</pre>
    //             </Tab.Pane>
    //           )
    //         }
    //         )}
    //       </Tab.Content>
    //     </Col>
    //   </Row>
    // </div>
};
const Kanban = ({ features, tests, results, kanban, openNewColumnModal, adminMode }) => {
    const board = {
        columns: [
            {
                id: -1,
                title: 'BACKLOG',
                cards: features.filter((f) => f.state === undefined)
            },
            {
                id: 0,
                title: 'ARCHIVE',
                cards: features.filter((f) => f.state === "ARCHIVED")
            },
            ...kanban.map((kb) => {
                return {
                    id: kb._id,
                    title: kb.title,
                    cards: features.filter((f) => f.state === kb._id)
                };
            }),
            // {
            //   id: 1,
            //   title: 'Backlog',
            //   cards: [
            //     {
            //       id: 1,
            //       title: 'Add card',
            //       description: 'Add capability to add a card in a column'
            //     },
            //   ]
            // },
        ]
    };
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example8", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement("button", { onClick: () => {
                            openNewColumnModal();
                        } }, "new column"),
                    React.createElement(UncontrolledBoard, { initialBoard: board }))));
    return React.createElement(Crud2, { schema: kanbanSchema, collectionName: "kanban", collection: kanban });
};
const GanttChart = ({ gantt, tests, results, features, adminMode }) => {
    if (!adminMode) {
        if (gantt.length > 1) {
            return React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement(Gantt, { tasks: (gantt || []).map((g) => {
                            console.log(g);
                            let task = {
                                start: new Date(2020, 1, 1),
                                end: new Date(2020, 1, 2),
                                name: g.name,
                                id: g._id,
                                type: g.type,
                                progress: 45,
                                isDisabled: false,
                                styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
                            };
                            console.log(task);
                            return task;
                        }) })));
        }
        else {
            return React.createElement("p", null, "you need to add some gantt items");
        }
    }
    return React.createElement(Crud2, { schema: ganttSchema, collectionName: "gantt", collection: gantt });
};
const Users = ({ users, adminMode }) => {
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example9", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement("ul", null, users.map((user) => {
                        return React.createElement("li", null, user.email);
                    })))));
    return React.createElement(Crud2, { schema: userSchema, collectionName: "users", collection: users });
};
const DocGalFsNav = ({ docGalFs, filepath }) => {
    return React.createElement("div", null,
        React.createElement("ul", null, ...docGalFs.map((lm) => {
            return React.createElement("li", null,
                React.createElement("a", { href: `${filepath}/${lm.name}` }, lm.name),
                lm.children.length > 0 && React.createElement(DocGalFsNav, { docGalFs: lm.children, filepath: `${filepath}/${lm.name}` }));
        })));
};
const DocGalFs = ({ docGalFs,
// tests, results, features, adminMode
 }) => {
    // return <Row>
    //   <Col sm={12}>
    //     {JSON.stringify(docGalFs, null, 2)}
    //   </Col>
    // </Row>
    return React.createElement(Row, null,
        React.createElement(Col, { sm: 4 },
            React.createElement(DocGalFsNav, { docGalFs: docGalFs, filepath: "" })),
        React.createElement(Col, { sm: 4 },
            React.createElement(Tab.Content, null)));
};
const DocGalDb = ({}) => {
    return React.createElement(Row, null,
        React.createElement(Col, { sm: 12 }, "DocGalDb"));
};
const ChatCatPeople = ({ users }) => {
    return React.createElement(Tab.Container, { id: "left-tabs-example9", defaultActiveKey: "feature-0" },
        React.createElement(Row, null,
            React.createElement(Col, { sm: 12 },
                React.createElement("ul", null, users.map((user) => {
                    return React.createElement("li", null, user.email);
                })))));
};
const ChatCatConversations = ({ users, conversations }) => {
    return React.createElement(Tab.Container, { id: "left-tabs-example9", defaultActiveKey: "feature-0" },
        React.createElement(Row, null,
            React.createElement(Col, { sm: 12 },
                React.createElement("ul", null, users.map((user) => {
                    return React.createElement("li", null, user.email);
                })))));
};
const ChatCatRooms = ({ users, rooms }) => {
    return React.createElement(Tab.Container, { id: "left-tabs-example9", defaultActiveKey: "feature-0" },
        React.createElement(Row, null,
            React.createElement(Col, { sm: 12 },
                React.createElement("ul", null, users.map((user) => {
                    return React.createElement("li", null, user.email);
                })))));
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
    const [features, setFeatures] = useState([]);
    const [kanban, setKanban] = useState([]);
    const importResults = async () => {
        const config = await (await fetch("./testeranto.json")).json();
        const results = await Promise.all(config.tests.map((test) => {
            return new Promise(async (res, rej) => {
                const src = test[0];
                const runtime = test[1];
                const s = [tests.buildDir, runtime].concat(src.split(".").slice(0, -1).join(".")).join("/");
                const exitcode = await (await fetch(config.outdir + "/" + s + "/exitcode")).text();
                const log = await (await fetch(config.outdir + "/" + s + "/log.txt")).text();
                const testresults = await (await fetch(config.outdir + "/" + s + "/tests.json")).json();
                const manifest = await (await fetch(config.outdir + "/" + s + "/manifest.json")).json();
                res({ src, exitcode, log, testresults, manifest });
            });
        }));
        setState({ tests: config.tests, results, buildDir: config.buildDir });
    };
    const importFeatures = async () => {
        fetch('http://localhost:3000/features.json')
            .then(response => response.json())
            .then(json => setFeatures(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importFeatures(); }, []);
    const importKanban = async () => {
        fetch('http://localhost:3000/kanbans.json')
            .then(response => response.json())
            .then(json => setKanban(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importKanban(); }, []);
    const [users, setUsers] = useState([]);
    const importUsers = async () => {
        fetch('http://localhost:3000/users.json')
            .then(response => response.json())
            .then(json => setUsers(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importUsers(); }, []);
    const [gantt, setGantt] = useState([]);
    const importGantt = async () => {
        fetch('http://localhost:3000/gantts.json')
            .then(response => response.json())
            .then(json => setGantt(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importGantt(); }, []);
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
        fetch('http://localhost:3000/docGal/fs.json')
            .then(response => response.json())
            .then(json => setDocGalFs(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importFs(); }, []);
    const [chatCatRooms, setChatCatRooms] = useState([]);
    const importChatCatRooms = async () => {
        fetch('http://localhost:3000/rooms.json')
            .then(response => response.json())
            .then(json => setChatCatRooms(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importChatCatRooms(); }, []);
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
                                React.createElement(Tab, { eventKey: "chatCat", title: React.createElement(NavLink, { to: "/chatCat/people", className: "nav-link" }, "ChatCat") })))),
                    React.createElement(ButtonGroup, { className: "mb-2" },
                        React.createElement(Button, { id: "login", value: "1", onChange: (e) => setAdminMode(!adminMode) }, "Login")))),
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/tests", element: React.createElement(Tests, { adminMode: adminMode, features: features, results: state.results, tests: tests }) }),
                React.createElement(Route, { path: "/chatCat/people", element: React.createElement(ChatCat, { chatCatRooms: chatCatRooms, chatCatHuddles: [], users: users },
                        React.createElement(ChatCatPeople, { users: users })) }),
                React.createElement(Route, { path: "/chatCat/conversations", element: React.createElement(ChatCat, { chatCatRooms: chatCatRooms, chatCatHuddles: [], users: users },
                        React.createElement(ChatCatConversations, { users: users, conversations: [] })) }),
                React.createElement(Route, { path: "/chatCat/rooms", element: React.createElement(ChatCat, { chatCatRooms: chatCatRooms, chatCatHuddles: [], users: users },
                        React.createElement(ChatCatRooms, { users: users, rooms: [] })) }),
                React.createElement(Route, { path: "/docGal/fs", element: React.createElement(DocGal, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(DocGalFs, { docGalFs: docGalFs })) }),
                React.createElement(Route, { path: "/docGal/db", element: React.createElement(DocGal, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(DocGalDb, null)) }),
                React.createElement(Route, { path: "/taskMan/features", element: React.createElement(TaskMan, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(Features, { adminMode: adminMode, features: features, results: state.results, tests: tests })) }),
                React.createElement(Route, { path: "/taskMan/kanban", element: React.createElement(TaskMan, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(Kanban, { adminMode: adminMode, kanban: kanban, results: state.results, tests: tests, features: features, openNewColumnModal: () => {
                            } })) }),
                React.createElement(Route, { path: "/taskMan/gantt", element: React.createElement(TaskMan, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(GanttChart, { adminMode: adminMode, gantt: gantt, features: features, results: state.results, tests: tests })) }),
                React.createElement(Route, { path: "/taskMan/users", element: React.createElement(TaskMan, { adminMode: adminMode, setAdminMode: setAdminMode, users: users },
                        React.createElement(Users, { adminMode: adminMode, users: users })) }))),
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
