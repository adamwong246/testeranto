import { ReactFlow } from '@xyflow/react';
import { Button, ButtonGroup, Container, Form, Navbar, Table, ToggleButton } from "react-bootstrap";
import React from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { NavLink } from 'react-router-dom';
const InputElementString = ({ tree, name }) => {
    console.log("mark string", tree);
    // return <Form.Control type="email" placeholder={name} />
    return React.createElement(Form.Group, { className: "mb-3", controlId: name },
        React.createElement(Form.Label, null, name),
        React.createElement(Form.Control, { placeholder: name }));
};
const InputElementArray = ({ tree, name }) => {
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
// export const TaskMan = ({ setAdminMode, users, adminMode, children }) => {
//   return <div>
//     <div className="row">
//       <Navbar expand="md" className="bg-body-tertiary">
//         <Container fluid>
//           {/* <Navbar.Brand href="#home">testeranto</Navbar.Brand> */}
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="me-auto">
//               < Tabs defaultActiveKey="/tests" >
//                 {/* <Tab eventKey="tests" title={<NavLink to="/tests" className="nav-link">Tests</NavLink>}></Tab> */}
//                 <Tab eventKey="features"
//                   title={<NavLink to="/taskMan/features" className="nav-link">Features</NavLink>
//                   }></Tab>
//                 <Tab eventKey="kanban" title={<NavLink to="/taskMan/kanban" className="nav-link">Kanban</NavLink>}></Tab>
//                 <Tab eventKey="gantt" title={<NavLink to="/taskMan/gantt" className="nav-link">Gantt</NavLink>}></Tab>
//                 {/* <Tab eventKey="users" title={<NavLink to="/taskMan/users" className="nav-link">Users</NavLink>}></Tab> */}
//               </Tabs>
//             </Nav>
//             <NavDropdown align="end" title="User" id="basic-nav-dropdown">
//               {
//                 users.map((user) => {
//                   return <NavDropdown.Item href="#action/3.1">
//                     {user.email}
//                   </NavDropdown.Item>
//                 })
//               }
//               {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
//                   <NavDropdown.Item href="#action/3.2">
//                     Another action
//                   </NavDropdown.Item>
//                   <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item> */}
//               <NavDropdown.Divider />
//               <NavDropdown.Item href="#action/3.4">
//                 all
//               </NavDropdown.Item>
//             </NavDropdown>
//             <ButtonGroup className="mb-2">
//               <ToggleButton
//                 id="toggle-check"
//                 type="checkbox"
//                 variant="outline-primary"
//                 checked={adminMode}
//                 value="1"
//                 onChange={(e) => setAdminMode(!adminMode)}
//               >
//                 ⚙️
//               </ToggleButton>
//             </ButtonGroup>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//     </div>
//     {children}
//   </div>
// };
export const DocGal = ({ setAdminMode, users, adminMode, children }) => {
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
export const ChatCat = ({ children }) => {
    return React.createElement("div", null,
        React.createElement("div", { className: "row" },
            React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
                React.createElement(Container, { fluid: true },
                    React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                    React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                        React.createElement(Nav, { className: "me-auto" },
                            React.createElement(Tabs, { defaultActiveKey: "/chatCat/mostRecent" },
                                React.createElement(Tab, { eventKey: "/chatCat/mostRecent", title: React.createElement(NavLink, { to: "/chatCat/mostRecent", className: "nav-link" }, "Most Recent") }),
                                React.createElement(Tab, { eventKey: "/chatCat/bySubject", title: React.createElement(NavLink, { to: "/chatCat/bySubject", className: "nav-link" }, "by Subject") }))))))),
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
export const WhoThat = ({ children }) => {
    return React.createElement("div", null,
        React.createElement("div", { className: "row" },
            React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
                React.createElement(Container, { fluid: true },
                    React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                    React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                        React.createElement(Nav, { className: "me-auto" },
                            React.createElement(Tabs, { defaultActiveKey: "/whoThat/people" },
                                React.createElement(Tab, { eventKey: "/whoThat/people", title: React.createElement(NavLink, { to: "/whoThat/people", className: "nav-link" }, "People") }),
                                React.createElement(Tab, { eventKey: "/whoThat/groups", title: React.createElement(NavLink, { to: "/whoThat/groups", className: "nav-link" }, "Groups") }),
                                React.createElement(Tab, { eventKey: "/whoThat/org", title: React.createElement(NavLink, { to: "/whoThat/org", className: "nav-link" }, "Org") }))),
                        React.createElement(ButtonGroup, { className: "mb-2" },
                            React.createElement(ToggleButton, { id: "toggle-check", type: "checkbox", variant: "outline-primary", checked: false, value: "1" }, "\u2699\uFE0F")))))),
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
export const Users = ({ users, adminMode }) => {
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example9", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement("ul", null, users.map((user) => {
                        return React.createElement("li", null, user.name);
                    })))));
    // return <Crud2 schema={userSchema} collectionName="users" collection={users} ></Crud2>
    return React.createElement("div", null);
};
export const OrgChart = ({ users, adminMode }) => {
    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    ];
    const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example9", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement("div", { style: { width: '100vw', height: '100vh' } },
                        React.createElement(ReactFlow, { nodes: [
                                ...initialNodes,
                                ...users.map((user) => {
                                    return ({ id: user._id, position: { x: 0, y: 0 }, data: { label: user.email } });
                                })
                            ], edges: initialEdges })))));
    // return <Crud2 schema={userSchema} collectionName="users" collection={users} ></Crud2>
    return React.createElement("div", null);
};
export const DocGalFsNav = ({ docGalFs, filepath }) => {
    return React.createElement("div", null,
        React.createElement("ul", null, ...docGalFs.map((lm) => {
            return React.createElement("li", null,
                React.createElement("a", { href: `${filepath}/${lm.name}` }, lm.name),
                lm.children.length > 0 && React.createElement(DocGalFsNav, { docGalFs: lm.children, filepath: `${filepath}/${lm.name}` }));
        })));
};
export const DocGalFs = ({ docGalFs,
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
export const DocGalDb = ({}) => {
    return React.createElement(Row, null,
        React.createElement(Col, { sm: 12 }, "DocGalDb"));
};
export const ChatCatPeople = ({ users }) => {
    return React.createElement(Tab.Container, { id: "left-tabs-example9", defaultActiveKey: "feature-0" },
        React.createElement(Row, null,
            React.createElement(Col, { sm: 12 },
                React.createElement("ul", null, users.map((user) => {
                    return React.createElement("li", null, user.email);
                })))));
};
export const ChatCatConversations = ({ users, conversations }) => {
    // return <Tab.Container id="left-tabs-example9" defaultActiveKey="feature-0">
    //   <Row>
    //     <Col sm={12}>
    //       <ul>
    //         {
    //           users.map((user) => {
    //             return <li>
    //               {user.email}
    //             </li>
    //           })
    //         }
    //       </ul>
    //     </Col>
    //   </Row>
    // </Tab.Container>
    return React.createElement(Row, null,
        React.createElement(Navbar, { expand: "md", className: "bg-body-tertiary" },
            React.createElement(Container, { fluid: true },
                React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                    React.createElement(Nav, { className: "me-auto" },
                        React.createElement(Tabs, { defaultActiveKey: "/chatCat/mostRecent" },
                            React.createElement(Tab, { eventKey: "/chatCat/mostRecent", title: React.createElement(NavLink, { to: "/chatCat/mostRecent", className: "nav-link" }, "Feature") }),
                            React.createElement(Tab, { eventKey: "/chatCat/bySubject", title: React.createElement(NavLink, { to: "/chatCat/bySubject", className: "nav-link" }, "Kanban") }),
                            React.createElement(Tab, { eventKey: "/chatCat/bySubject", title: React.createElement(NavLink, { to: "/chatCat/bySubject", className: "nav-link" }, "Gantt") }),
                            React.createElement(Tab, { eventKey: "/chatCat/bySubject", title: React.createElement(NavLink, { to: "/chatCat/bySubject", className: "nav-link" }, "FS docs") }),
                            React.createElement(Tab, { eventKey: "/chatCat/bySubject", title: React.createElement(NavLink, { to: "/chatCat/bySubject", className: "nav-link" }, "DB docs") }),
                            React.createElement(Tab, { eventKey: "/chatCat/bySubject", title: React.createElement(NavLink, { to: "/chatCat/bySubject", className: "nav-link" }, "Groups") }))),
                    React.createElement(ButtonGroup, { className: "mb-2" },
                        React.createElement(ToggleButton, { id: "toggle-check", type: "checkbox", variant: "outline-primary", checked: false, value: "1" }, "\u2699\uFE0F"))))));
};
export const ChatCatRooms = ({ users, rooms }) => {
    return React.createElement(Tab.Container, { id: "left-tabs-example9", defaultActiveKey: "feature-0" },
        React.createElement(Row, null,
            React.createElement(Col, { sm: 12 },
                React.createElement("ul", null, users.map((user) => {
                    return React.createElement("li", null, user.email);
                })))));
};
