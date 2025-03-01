import { Button, ButtonGroup, Container, Dropdown, DropdownButton, Form, Navbar, NavDropdown, Table, ToggleButton } from "react-bootstrap";
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
import LoginButton from './LoginButton';
import {
  DocGal, ChatCat, ChatCatConversations, ChatCatPeople, DocGalDb, DocGalFs,
  OrgChart, Users, WhoThat, TaskMan
} from './react';
import { TestTab } from './TestTab';
import { Kanban } from './TaskManKanBan';
import { IKanban, IMilestone, IProject, ITask, IUser } from './TaskManTypes';
import { Features } from './TaskManFeatures';
import { GanttChart } from './TaskManGantt';

const collectionEffect = (
  collection: string,
  setter: (any) => any,
  coercer: (any) => any = (x) => x
) => {
  useEffect(() => {
    (async () => {
      fetch(`http://localhost:8080/${collection}.json`)
        .then(response => response.json())
        .then(json => {
          Promise.all(json.ids.map(async (_id) => {
            return {
              _id,
              ...coercer(await (await fetch(`http://localhost:8080/${collection}/${_id}.json`)).json())
            };
          })).then((items: any[]) => {
            console.log("setting", collection, items)
            setter(items)
          })
        })
        .catch(error => console.error(error));

    })();
  }, []);
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

  const [users, setUsers] = useState<({ _id: string } & IUser)[]>(
    []
  );


  const importUsers = async () => {
    fetch('http://localhost:8080/User.json')
      .then(response => response.json())
      .then(json => {
        Promise.all(json.ids.map(async (_id) => {
          return await (await fetch(`http://localhost:8080/User/${_id}.json`)).json();
        })).then((allUsers: IUser[]) => {
          console.log("allUsers", allUsers)
          setUsers(allUsers)
        })
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

  const [docGalFs, setDocGalFs] = useState<IUser[]>(
    []
  );

  const importFs = async () => {
    fetch('http://localhost:8080/docGal/fs.json')
      .then(response => response.json())
      .then(json => setDocGalFs(json))
      .catch(error => console.error(error));

  };
  useEffect(() => { importFs(); }, []);


  const [chatCatRooms, setChatCatRooms] = useState<(
    { _id: string }// & IChatCatRoom
  )[]>(
    []
  );

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

  const [currentRepo, setRepo] = useState<string>(
    "ChromaPDX/kokomoBay"
  );

  const [currentBranch, setBranch] = useState<string>(
    "master"
  );

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

      <Router>

        <Navbar expand="md" className="bg-body-tertiary">
          <Container fluid>
            {/* <Navbar.Brand href="#home">testeranto</Navbar.Brand> */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {/* <Nav.Link href="#home">Tests</Nav.Link>
                <Nav.Link href="#link">TaskMan</Nav.Link> */}

                < Tabs defaultActiveKey="/tests" >


                  <Tab eventKey="tests" title={<NavLink to="/tests" className="nav-link">TestPup</NavLink>}></Tab>
                  <Tab eventKey="taskMan" title={<NavLink to="/taskMan/features" className="nav-link">TaskMan</NavLink>}></Tab>
                  <Tab eventKey="docGal" title={<NavLink to="/docGal/fs" className="nav-link">DocGal</NavLink>}></Tab>
                  <Tab eventKey="chatCat" title={<NavLink to="/chatCat/mostRecent" className="nav-link">ChatCat</NavLink>}></Tab>
                  <Tab eventKey="whoThat" title={<NavLink to="/whoThat/people" className="nav-link">WhoThat</NavLink>}></Tab>
                </Tabs>



              </Nav>



            </Navbar.Collapse>

            <LoginButton />
            {/* <ButtonGroup className="mb-2">
              <Button
                id="login"
                value="1"
                onChange={(e) => setAdminMode(!adminMode)}
              >
                Login
              </Button>
            </ButtonGroup> */}

          </Container>
        </Navbar>

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


          <Route path="/chatCat/mostRecent" element={
            <ChatCat
              chatCatRooms={chatCatRooms}
              chatCatHuddles={[]}
              users={users}
            >
              <ChatCatPeople users={users} />

            </ChatCat>} />

          <Route path="/chatCat/bySubject" element={
            <ChatCat
              chatCatRooms={chatCatRooms}
              chatCatHuddles={[]}
              users={users}
            >
              <ChatCatConversations users={users} conversations={[]} />

            </ChatCat>} />

          <Route path="/docGal/fs" element={
            <DocGal adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
              <DocGalFs docGalFs={docGalFs} />
            </DocGal>} />

          <Route path="/docGal/db" element={
            <DocGal adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
              <DocGalDb />
            </DocGal>} />

          <Route path="/taskMan/features" element={
            <TaskMan adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
              <Features
                adminMode={adminMode}
                tests={tests}
              />
            </TaskMan>} />

          <Route path="/taskMan/kanban" element={
            <TaskMan adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
              <Kanban
                adminMode={adminMode}
                kanban={kanban}
                tests={tests}
                tasks={tasks}
                openNewColumnModal={() => {
                }}
              />
            </TaskMan>} />

          <Route path="/taskMan/gantt" element={
            <TaskMan adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
              <GanttChart
                adminMode={adminMode}
                tasks={tasks}
                milestones={milestones}
                projects={projects}

                tests={tests} />
            </TaskMan>
          } />
          <Route path="/whoThat/people" element={
            <WhoThat users={users} >
              <Users adminMode={adminMode} users={users} />
            </WhoThat>
          } />

          <Route path="/whoThat/groups" element={
            <WhoThat users={users} >
              <Users adminMode={adminMode} users={users} />
            </WhoThat>
          } />

          <Route path="/whoThat/org" element={
            <WhoThat users={users} >
              <OrgChart adminMode={adminMode} users={users} />
            </WhoThat>
          } />


        </Routes>
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
