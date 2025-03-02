import { ReactFlow } from "@xyflow/react";
// import {
//   Button, ButtonGroup, Container, Dropdown, DropdownButton, Form, Navbar, NavDropdown, Table, ToggleButton
// } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import '@caldwell619/react-kanban/dist/styles.css'
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@xyflow/react/dist/style.css';


import { IRunTime } from "./lib/types";
// import LoginButton from './LoginButton';
// import {
//   DocGal, ChatCat, ChatCatConversations, ChatCatPeople, DocGalDb, DocGalFs,
//   OrgChart, Users, WhoThat
// } from './react';
import { TestTab } from './TestTab';
import { Kanban } from './TaskManKanBan';
import { IKanban, IMilestone, IProject, ITask, IUser } from './TaskManTypes';
import { Features } from './TaskManFeatures';
import { GanttChart } from './TaskManGantt';
import { TaskManOwners } from "./TaskManOwners";
import { Sprint } from "./TaskManSprint";
import { collectionEffect } from "./collectionEffect";
import { Git } from "./TaskManGit";




const UserModal = ({ _id, users }: { _id: string, users: IUser[] }) => {
  const u = users.find((u) => u._id === _id);

  if (!u) { return <pre>user not found</pre> }
  return <>
    <h1>{u._id}</h1>
    <h2>{u.email}</h2>
    <p>{u.profile}</p>
  </>
  // return <pre>{JSON.stringify(u)}</pre>
}

const Report = () => {

  const [state, setState] = useState<{
    tests: any[],
    buildDir: string,
    results: any
  }>({
    tests: [],
    buildDir: "",
    results: {}
  });

  const [tests, setTests] = useState<
    {
      tests: any[],
      buildDir: string,
    }
  >
    ({
      tests: [],
      buildDir: ""
    });

  const [kanban, setKanban] = useState<any[]>(
    []
  );

  const importResults = async () => {
    const config = await (await fetch("./testeranto.json")).json();
    const results = await Promise.all(config.tests.map((test) => {
      return new Promise(async (res, rej) => {
        const src: string = test[0];
        const runtime: IRunTime = test[1];
        const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
        const exitcode = await (await fetch("/docs" + "/" + s + "/exitcode")).text()
        const log = await (await fetch("/docs" + "/" + s + "/log.txt")).text()
        const testresults = await (await fetch("/docs" + "/" + s + "/tests.json")).json()
        const manifest = await (await fetch("/docs" + "/" + s + "/manifest.json")).json()

        res({ src, exitcode, log, testresults, manifest })
      })
    }))

    setState({ tests: config.tests as any, results, buildDir: config.buildDir })
  };

  ///////////////////////////////////////////

  const [tasks, setTasks] = useState<ITask[]>(
    []
  );
  collectionEffect(`Task`, setTasks, (t) => {
    return {
      ...t,
      start: new Date(t.start),
      end: new Date(t.end),
    }
  });

  const [milestones, setMilestones] = useState<IMilestone[]>(
    []
  );
  collectionEffect(`Milestone`, setMilestones, (m) => {
    return {
      ...m,
      start: new Date(m.date),
      end: new Date(m.date),
    }
  });

  const [projects, setProjects] = useState<IProject[]>(
    []
  );
  collectionEffect(`Project`, setProjects);

  const [users, setUsers] = useState<({ _id: string } & IUser)[]>(
    []
  );
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
          return {
            _id,
            ...await (await fetch(`http://localhost:8080/Kanban/${_id}.json`)).json()
          };
        })).then((allKanbans: IKanban[]) => {
          console.log("allKanbans", allKanbans)
          setKanban(allKanbans)
        })
      })
      .catch(error => console.error(error));

  };
  useEffect(() => { importKanban(); }, []);

  const importTests = async () => {
    const x = await fetch("./testeranto.json")
    const y = await x.json();
    setTests(y as any);
  };

  useEffect(() => { importResults(); }, []);

  useEffect(() => { importTests(); }, []);

  const [activeKey, setActiveKey] = useState('home');

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };


  const [adminMode, setAdminMode] = useState(false);

  // const [docGalFs, setDocGalFs] = useState<IUser[]>(
  //   []
  // );

  // const importFs = async () => {
  //   fetch('http://localhost:8080/docGal/fs.json')
  //     .then(response => response.json())
  //     .then(json => setDocGalFs(json))
  //     .catch(error => console.error(error));

  // };
  // useEffect(() => { importFs(); }, []);


  const [modal, setModal] = useState<[string, string] | undefined>();

  // const importChatCatRooms = async () => {
  //   fetch('http://localhost:8080/rooms.json')
  //     .then(response => response.json())
  //     .then(json => setChatCatRooms(json))
  //     .catch(error => console.error(error));
  // };
  // useEffect(() => { importChatCatRooms(); }, []);

  const reposAndBranches = {
    "ChromaPDX/kokomoBay": [
      "master"
    ]
  };

  const [currentRepo, setRepo] = useState<string>(
    "ChromaPDX/kokomoBay"
  );

  const [currentBranch, setBranch] = useState<string>(
    "master"
  );


  const initialEdges = [
    { id: 'e1-2', source: 'adam', target: 'marcus' }
  ];

  const orgNodes = [
    // ...initialNodes,
    ...users.map((user) => {
      return ({
        id: user._id, position: {
          x: (Math.random() * 600) + 300,
          y: (Math.random() * 600) + 301
        }, data: { label: user._id }
      })
    })];

  console.log("orgNodes", orgNodes);

  return (
    <div>
      <style>
        {`
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
          `}
      </style>

      {
        modal && <div style={{
          "position": "fixed", /* Stay in place */
          "zIndex": 1, /* Sit on top */
          left: 0,
          top: 0,
          width: "100%", /* Full width */
          height: "100%", /* Full height */
          overflow: "auto", /* Enable scroll if needed */
          "backgroundColor": "rgba(0,0,0,0.4)" /* Black w/ opacity */
        }}>
          <div style={{
            backgroundColor: "#fefefe",
            margin: "15% auto", /* 15% from the top and centered */
            padding: "20px",
            border: "1px solid #888",
            width: "80%" /* Could be more or less, depending on screen size */
          }}>
            {
              modal && modal[0] === "User" && <UserModal users={users} _id={modal[1]} />
            }
            <button onClick={() => setModal(undefined)}>OK</button>
          </div>
        </div>
      }


      <Router>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={1}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item >
                  <NavLink to="/tests" className="nav-link">tests</NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/features" className="nav-link">features</NavLink>
                </Nav.Item>
                <Nav.Item >
                  <NavLink to="/git" className="nav-link">git</NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/kanban" className="nav-link">kanban</NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/sprint" className="nav-link">sprint</NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/gantt" className="nav-link">gantt</NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/owners" className="nav-link">owners</NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/org" className="nav-link">org</NavLink>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={11}>
              <Tab.Content>

                <Routes>
                  <Route path="/tests" element={<
                    TestTab
                    adminMode={adminMode}
                    tasks={tasks}
                    results={state.results}
                    tests={tests}
                    reposAndBranches={reposAndBranches}
                    setRepo={setRepo}
                    currentRepo={currentRepo}
                    currentBranch={currentBranch} />}
                  />

                  <Route path="/tests/:id/log.txt" element={<
                    TestTab
                    adminMode={adminMode}
                    tasks={tasks}
                    results={state.results}
                    tests={tests}
                    reposAndBranches={reposAndBranches}
                    setRepo={setRepo}
                    currentRepo={currentRepo}
                    currentBranch={currentBranch}
                  // currentTest={currentTest}
                  // currentTestResultFile={currentTestResultFile}
                  />}
                  />

                  <Route path="/sprint" element={
                    <Sprint
                      adminMode={adminMode}
                    // tests={tests}
                    />} />
                  <Route path="/sprint/:id" element={
                    <Sprint
                      adminMode={adminMode}
                    // tests={tests}
                    />} />



                  <Route path="/features" element={
                    <Features
                      adminMode={adminMode}
                      tests={tests}
                    />} />

                  <Route path="/features/:collection/:id" element={
                    <Features
                      adminMode={adminMode}
                      tests={tests}
                    />} />


                  <Route path="/git" element={
                    <Git
                      adminMode={adminMode}
                    // tests={tests}
                    />} />

                  <Route path="/kanban" element={
                    <Kanban
                      adminMode={adminMode}
                      kanban={kanban}
                      tests={tests}
                      tasks={tasks}
                      openNewColumnModal={() => {
                      }}
                    />} />

                  <Route path="/gantt" element={
                    <GanttChart
                      adminMode={adminMode}
                      tasks={tasks}
                      milestones={milestones}
                      projects={projects}
                      tests={tests} />
                  } />

                  <Route path="/owners" element={
                    <TaskManOwners
                      tasks={tasks}
                      milestones={milestones}
                      projects={projects}
                      users={users}
                      setModal={setModal}
                    />
                  } />

                  <Route path="/owners/:id" element={
                    <TaskManOwners
                      tasks={tasks}
                      milestones={milestones}
                      projects={projects}
                      users={users}
                      setModal={setModal}
                    />
                  } />

                  <Route path="/org" element={
                    <div style={{ width: '100vw', height: '100vh' }}>
                      <ReactFlow nodes={
                        orgNodes
                      } edges={initialEdges} />
                    </div>
                  } />

                </Routes>

              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>



      </Router>


      <footer>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto </a></footer>

    </div >
  );
};

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Report, {}));
  }
});
