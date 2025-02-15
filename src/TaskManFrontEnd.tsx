import { ReactFlow } from '@xyflow/react';
import { Button, ButtonGroup, Container, Dropdown, DropdownButton, Form, Navbar, NavDropdown, Table, ToggleButton } from "react-bootstrap";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import { UncontrolledBoard, KanbanBoard } from '@caldwell619/react-kanban'
import '@caldwell619/react-kanban/dist/styles.css'
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@xyflow/react/dist/style.css';
import { IRunTime } from "./lib/types";

import {
  IFeature, featuresSchema, ganttSchema, IKanban, IUser, kanbanSchema, userSchema,
  IGantt,
  IChatCatHuddle,
  IChatCatRoom
} from "./mongooseSchemas";

const InputElementString = ({ tree, name }: { tree: any, name: string }) => {
  console.log("mark string", tree)

  // return <Form.Control type="email" placeholder={name} />
  return <Form.Group className="mb-3" controlId={name}>
    <Form.Label>{name}</Form.Label>
    <Form.Control placeholder={name} />

  </Form.Group>
};

const InputElementArray = ({ tree, name }: { tree: any, name: string }) => {
  console.log("mark5", tree)

  return <Form.Control type="email" placeholder="Enter email" />
};

const InputElementObject = ({ tree, name }: { tree: any, name?: string }) => {
  // const x = schema.path(path);

  console.log("mark4", tree, tree.properties)

  return <div>
    {
      ...Object.keys(tree.properties).map((name) => {

        console.log("mark6", name, tree.properties[name].type)

        if (tree.properties[name].type === "object") {
          return <InputElementObject tree={tree.properties[name]} name={name}  ></InputElementObject >
        }

        if (tree.properties[name].type === "string") {
          return <InputElementString tree={tree.properties[name]} name={name} ></InputElementString >
        }

        if (Array.isArray(tree.properties[name].type)) {
          return <InputElementArray tree={tree.properties[name]} name={name} ></InputElementArray >
        }

      })
    }
  </div >


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


const InputForm = ({ schema, path }: { schema: mongoose.Schema, path?: string }) => {

  return <Form.Group>

    <InputElementObject tree={schema.toJSONSchema()}  ></InputElementObject>


  </Form.Group>

};

const Crud2 = ({ collection, collectionName, schema }: { collection: any, collectionName: string, schema: mongoose.Schema }) => {
  return <div>
    {/* <h3>{collectionName}</h3> */}
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>id</th>
          <th></th>

        </tr>
      </thead>
      <tbody>
        <tr>

          <td>add new record</td>
          <td>
            <Form>
              {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group> */}


              <InputForm schema={schema}></InputForm>


              <Button variant="primary" type="submit">
                Submit
              </Button>


            </Form>
          </td>

        </tr>
        {
          collection.map((doc) => {
            return <tr>
              <td>{doc._id}</td>
              <td>{JSON.stringify(doc, null, 2)}</td>
            </tr>
          })
        }


      </tbody>
    </Table>
  </div>
}

const Features = ({ features, tests, results, adminMode }) => {
  if (!adminMode) return <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
    <Row>
      <Col sm={4}>
        <Nav variant="pills" className="flex-column">
          {(features).map((feature, ndx) => <Nav.Item key={ndx}>
            <Nav.Link eventKey={`feature/${feature._id}`}>
              {feature.title}
            </Nav.Link>
          </Nav.Item>)}
        </Nav>
      </Col>
      <Col sm={8}>
        <Tab.Content>
          {(features).map((feature, ndx) => {
            // const feature = features[featureKey];
            return (
              <Tab.Pane eventKey={`feature/${feature._id}`} key={ndx}>
                <pre>{JSON.stringify(feature, null, 2)}</pre>

                {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}

                <ol>
                  {
                    results.filter((result) => {
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


                      return new Set(result.testresults.givens.reduce((mm: string[], el) => {
                        mm = mm.concat(el.features)

                        // console.log("mark2", el);

                        // el.features.forEach((feature) => {
                        //   mm.add(feature)
                        // });
                        return mm;
                      }, [])).has(feature._id)

                    }).map((result) => {
                      return <li>
                        {/* <pre>{JSON.stringify(test.src, null, 2)}</pre> */}
                        {result.src}
                      </li>
                    })
                  }
                </ol>

              </Tab.Pane>
            )
          }
          )}
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>;


  return <Crud2 schema={featuresSchema} collectionName="features" collection={features}></Crud2>
};

const Tests = ({ tests, results, features, adminMode }) => {
  if (!adminMode) return <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
    <Row>
      <Col sm={4}>
        <Nav variant="pills" className="flex-column">
          {
            tests.tests.map((t, ndx) =>
              <Nav.Item key={ndx}>
                <Nav.Link eventKey={`test-${ndx}`}>
                  {t[0]} - {t[1]}
                </Nav.Link>
              </Nav.Item>
            )
          }
        </Nav>
      </Col>

      <Col sm={4}>
        <Tab.Content>

          {
            tests.tests.map((t, ndx) =>
              <Tab.Pane eventKey={`test-${ndx}`}>
                {/* <pre>{JSON.stringify(t, null, 2)}</pre> */}
                {/* <pre>{JSON.stringify(state.results, null, 2)}</pre> */}
                <pre>{JSON.stringify(Object.entries(results).filter(([k, v]: [string, { src: string }]) => {
                  console.log(v.src, tests.tests[ndx][0])
                  return v.src === tests.tests[ndx][0]
                }), null, 2)}</pre>

                {/* {tests.tests.map((t, ndx) => {
                          return (
                            <Tab.Pane eventKey={`feature-${ndx}`} key={ndx}>
                              <pre>{JSON.stringify(t, null, 2)}</pre>
                            </Tab.Pane>
                          )
                        }
                        )} */}

              </Tab.Pane>

            )
          }




        </Tab.Content>
      </Col>


    </Row>
  </Tab.Container>

  // return <Crud collectionName="features" collection={features}></Crud>
  return <div></div>

};

const TaskMan = ({ setAdminMode, users, adminMode, children }) => {
  return <div>
    <div className="row">
      <Navbar expand="md" className="bg-body-tertiary">
        <Container fluid>
          {/* <Navbar.Brand href="#home">testeranto</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              < Tabs defaultActiveKey="/tests" >
                {/* <Tab eventKey="tests" title={<NavLink to="/tests" className="nav-link">Tests</NavLink>}></Tab> */}
                <Tab eventKey="features"

                  title={<NavLink to="/taskMan/features" className="nav-link">Features</NavLink>


                  }></Tab>

                <Tab eventKey="kanban" title={<NavLink to="/taskMan/kanban" className="nav-link">Kanban</NavLink>}></Tab>
                <Tab eventKey="gantt" title={<NavLink to="/taskMan/gantt" className="nav-link">Gantt</NavLink>}></Tab>
                {/* <Tab eventKey="users" title={<NavLink to="/taskMan/users" className="nav-link">Users</NavLink>}></Tab> */}
              </Tabs>



            </Nav>

            <NavDropdown align="end" title="User" id="basic-nav-dropdown">
              {
                users.map((user) => {
                  return <NavDropdown.Item href="#action/3.1">
                    {user.email}
                  </NavDropdown.Item>
                })
              }
              {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item> */}
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                all
              </NavDropdown.Item>
            </NavDropdown>

            <ButtonGroup className="mb-2">
              <ToggleButton
                id="toggle-check"
                type="checkbox"
                variant="outline-primary"
                checked={adminMode}
                value="1"
                onChange={(e) => setAdminMode(!adminMode)}
              >
                ⚙️
              </ToggleButton>
            </ButtonGroup>

          </Navbar.Collapse>
        </Container>


      </Navbar>
    </div>
    {children}
  </div>

};

const DocGal = ({ setAdminMode, users, adminMode, children }) => {
  return <div>
    <div className="row">
      <Navbar expand="md" className="bg-body-tertiary">
        <Container fluid>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="docGal-navbar-nav">
            <Nav className="me-auto">
              < Tabs defaultActiveKey="/fs" >

                <Tab eventKey="fs" title={<NavLink to="/docGal/fs" className="nav-link">FS</NavLink>}></Tab>
                <Tab eventKey="db" title={<NavLink to="/docGal/db" className="nav-link">DB</NavLink>}></Tab>

              </Tabs>



            </Nav>



          </Navbar.Collapse>
        </Container>


      </Navbar>
    </div>
    {children}
  </div>

};

const ChatCat = ({ children }: {
  children: any,
  chatCatRooms: ({ _id: string } & IChatCatRoom)[],
  chatCatHuddles: ({ _id: string } & any)[],
  users: ({ _id: string } & IUser)[],

}) => {
  return <div>
    <div className="row">
      <Navbar expand="md" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              < Tabs defaultActiveKey="/chatCat/mostRecent" >
                <Tab eventKey="/chatCat/mostRecent" title={<NavLink to="/chatCat/mostRecent" className="nav-link">Most Recent</NavLink>}></Tab>
                <Tab eventKey="/chatCat/bySubject" title={<NavLink to="/chatCat/bySubject" className="nav-link">by Subject</NavLink>}></Tab>
              </Tabs>



            </Nav>




          </Navbar.Collapse>
        </Container>


      </Navbar>
    </div>
    {children}
  </div>
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

const WhoThat = ({ children }: {
  children: any,
  // chatCatRooms: ({ _id: string } & IChatCatRoom)[],
  // chatCatHuddles: ({ _id: string } & any)[],
  users: ({ _id: string } & IUser)[],

}) => {
  return <div>
    <div className="row">
      <Navbar expand="md" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              < Tabs defaultActiveKey="/whoThat/people" >
                <Tab eventKey="/whoThat/people" title={<NavLink to="/whoThat/people" className="nav-link">People</NavLink>}></Tab>
                <Tab eventKey="/whoThat/groups" title={<NavLink to="/whoThat/groups" className="nav-link">Groups</NavLink>}></Tab>
                <Tab eventKey="/whoThat/org" title={<NavLink to="/whoThat/org" className="nav-link">Org</NavLink>}></Tab>
              </Tabs>



            </Nav>


            <ButtonGroup className="mb-2">
              <ToggleButton
                id="toggle-check"
                type="checkbox"
                variant="outline-primary"
                checked={false}
                value="1"
              // onChange={(e) => setAdminMode(!adminMode)}
              >
                ⚙️
              </ToggleButton>
            </ButtonGroup>
          </Navbar.Collapse>



        </Container>


      </Navbar>
    </div>
    {children}
  </div>
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

const Kanban = ({
  features, tests, results, kanban, openNewColumnModal, adminMode
}: {
  features: IFeature[],
  tests: any,
  kanban: (IKanban & { _id: string })[],
  results: any,
  openNewColumnModal: any,
  adminMode: boolean,
}) => {

  const board: KanbanBoard<any> = {
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
        }
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
  }

  if (!adminMode) return <Tab.Container id="left-tabs-example8" defaultActiveKey="feature-0">


    <Row>
      <Col sm={12}>
        <button onClick={() => {
          openNewColumnModal()
        }}>new column</button>
        <UncontrolledBoard initialBoard={board} />
      </Col>
    </Row>
  </Tab.Container>

  return <Crud2 schema={kanbanSchema} collectionName="kanban" collection={kanban}></Crud2>

};

const GanttChart = ({ gantt, tests, results, features, adminMode }: {
  gantt: IGantt[],
  tests: any,
  results: any,
  features: any,
  adminMode: boolean

}) => {
  if (!adminMode) {
    if (gantt.length > 1) {
      return <Row>
        <Col sm={12}>
          <Gantt tasks={(gantt || []).map((g: IGantt & { _id: string }) => {
            console.log(g)
            let task: Task =
            {
              start: new Date(2020, 1, 1),
              end: new Date(2020, 1, 2),
              name: g.name,
              id: g._id,
              type: g.type,
              progress: 45,
              isDisabled: false,
              styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
            };

            console.log(task)
            return task;
          })} />
        </Col>
      </Row>
    } else {
      return <p>you need to add some gantt items</p>
    }
  }

  return <Crud2 schema={ganttSchema} collectionName="gantt" collection={gantt}></Crud2>

};

const Users = ({ users, adminMode }) => {
  if (!adminMode) return <Tab.Container id="left-tabs-example9" defaultActiveKey="feature-0">
    <Row>
      <Col sm={12}>
        <ul>
          {
            users.map((user) => {
              return <li>
                {user.email}
              </li>
            })
          }
        </ul>
      </Col>
    </Row>
  </Tab.Container>

  return <Crud2 schema={userSchema} collectionName="users" collection={users} ></Crud2>

};

const OrgChart = ({ users, adminMode }) => {

  const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ];
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];


  if (!adminMode) return <Tab.Container id="left-tabs-example9" defaultActiveKey="feature-0">
    <Row>
      <Col sm={12}>
        <div style={{ width: '100vw', height: '100vh' }}>
          <ReactFlow nodes={[
            ...initialNodes,
            ...users.map((user) => {
              return ({ id: user._id, position: { x: 0, y: 0 }, data: { label: user.email } })
            })
          ]} edges={initialEdges} />
        </div>
      </Col>
    </Row>
  </Tab.Container>

  return <Crud2 schema={userSchema} collectionName="users" collection={users} ></Crud2>

};

const DocGalFsNav = ({ docGalFs, filepath }: {
  filepath: string
  docGalFs: {
    name: string,
    children: any[]
  }[]
}) => {

  return <div>
    <ul>
      {
        ...docGalFs.map((lm) => {
          return <li>
            <a href={`${filepath}/${lm.name}`}>{lm.name}</a>
            {/* <p>{lm.name}</p>
            <p>{lm.name}</p> */}
            {
              lm.children.length > 0 && <DocGalFsNav docGalFs={lm.children} filepath={`${filepath}/${lm.name}`} />
            }
          </li>
        })
      }
    </ul>
  </div>
}

const DocGalFs = ({
  docGalFs,
  // tests, results, features, adminMode
}: {
  docGalFs: any[],
  // tests: any,
  // results: any,
  // features: any,
  // adminMode: boolean

}) => {
  // return <Row>
  //   <Col sm={12}>
  //     {JSON.stringify(docGalFs, null, 2)}
  //   </Col>
  // </Row>

  return <Row>
    <Col sm={4}>
      <DocGalFsNav docGalFs={docGalFs} filepath="" />
      {/* {JSON.stringify(docGalFs, null, 2)} */}
      {/* <Nav variant="pills" className="flex-column">
        {
          docGalFs.map((t, ndx) =>
            <Nav.Item key={ndx}>
              <Nav.Link eventKey={`docGalFs-${ndx}`}>
                {t}
              </Nav.Link>
            </Nav.Item>
          )
        }
      </Nav> */}
    </Col>

    <Col sm={4}>
      <Tab.Content>






      </Tab.Content>
    </Col>


  </Row>

};

const DocGalDb = ({
  // gantt, tests, results, features, adminMode
}: {
    // gantt: IGantt[],
    // tests: any,
    // results: any,
    // features: any,
    // adminMode: boolean

  }) => {
  return <Row>
    <Col sm={12}>
      DocGalDb
    </Col>
  </Row>

};

const ChatCatPeople = ({ users }) => {
  return <Tab.Container id="left-tabs-example9" defaultActiveKey="feature-0">
    <Row>
      <Col sm={12}>
        <ul>
          {
            users.map((user) => {
              return <li>
                {user.email}
              </li>
            })
          }
        </ul>
      </Col>
    </Row>
  </Tab.Container>
};

const ChatCatConversations = ({ users, conversations }: {
  users: any,
  conversations: any;
}) => {
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
  return <Row>
    <Navbar expand="md" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            < Tabs defaultActiveKey="/chatCat/mostRecent" >
              <Tab eventKey="/chatCat/mostRecent" title={<NavLink to="/chatCat/mostRecent" className="nav-link">Feature</NavLink>}></Tab>
              <Tab eventKey="/chatCat/bySubject" title={<NavLink to="/chatCat/bySubject" className="nav-link">Kanban</NavLink>}></Tab>
              <Tab eventKey="/chatCat/bySubject" title={<NavLink to="/chatCat/bySubject" className="nav-link">Gantt</NavLink>}></Tab>
              <Tab eventKey="/chatCat/bySubject" title={<NavLink to="/chatCat/bySubject" className="nav-link">FS docs</NavLink>}></Tab>
              <Tab eventKey="/chatCat/bySubject" title={<NavLink to="/chatCat/bySubject" className="nav-link">DB docs</NavLink>}></Tab>
              <Tab eventKey="/chatCat/bySubject" title={<NavLink to="/chatCat/bySubject" className="nav-link">Groups</NavLink>}></Tab>
            </Tabs>



          </Nav>

          <ButtonGroup className="mb-2">
            <ToggleButton
              id="toggle-check"
              type="checkbox"
              variant="outline-primary"
              checked={false}
              value="1"
            // onChange={(e) => setAdminMode(!adminMode)}
            >
              ⚙️
            </ToggleButton>
          </ButtonGroup>


        </Navbar.Collapse>
      </Container>


    </Navbar>
  </Row>
};

const ChatCatRooms = ({ users, rooms }) => {
  return <Tab.Container id="left-tabs-example9" defaultActiveKey="feature-0">
    <Row>
      <Col sm={12}>
        <ul>
          {
            users.map((user) => {
              return <li>
                {user.email}
              </li>
            })
          }
        </ul>
      </Col>
    </Row>
  </Tab.Container>
};

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

  const [features, setFeatures] = useState<IFeature[]>(
    []
  );


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

  const [users, setUsers] = useState<({ _id: string } & IUser)[]>(
    []
  );


  const importUsers = async () => {
    fetch('http://localhost:3000/users.json')
      .then(response => response.json())
      .then(json => setUsers(json))
      .catch(error => console.error(error));

  };
  useEffect(() => { importUsers(); }, []);


  const [gantt, setGantt] = useState<IGantt[]>(
    []
  );

  const importGantt = async () => {
    fetch('http://localhost:3000/gantts.json')
      .then(response => response.json())
      .then(json => setGantt(json))
      .catch(error => console.error(error));

  };
  useEffect(() => { importGantt(); }, []);

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
    fetch('http://localhost:3000/docGal/fs.json')
      .then(response => response.json())
      .then(json => setDocGalFs(json))
      .catch(error => console.error(error));

  };
  useEffect(() => { importFs(); }, []);


  const [chatCatRooms, setChatCatRooms] = useState<({ _id: string } & IChatCatRoom)[]>(
    []
  );

  const importChatCatRooms = async () => {
    fetch('http://localhost:3000/rooms.json')
      .then(response => response.json())
      .then(json => setChatCatRooms(json))
      .catch(error => console.error(error));
  };
  useEffect(() => { importChatCatRooms(); }, []);


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

            <ButtonGroup className="mb-2">
              <Button
                id="login"



                value="1"
                onChange={(e) => setAdminMode(!adminMode)}
              >
                Login
              </Button>
            </ButtonGroup>

          </Container>
        </Navbar>

        <Routes>
          <Route path="/tests" element={<Tests adminMode={adminMode} features={features} results={state.results} tests={tests} />} />

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
              <Features adminMode={adminMode} features={features} results={state.results} tests={tests} />
            </TaskMan>} />

          <Route path="/taskMan/kanban" element={
            <TaskMan adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
              <Kanban
                adminMode={adminMode} kanban={kanban} results={state.results} tests={tests} features={features}
                openNewColumnModal={() => {
                }}
              />
            </TaskMan>} />

          <Route path="/taskMan/gantt" element={
            <TaskMan adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
              <GanttChart
                adminMode={adminMode} gantt={gantt} features={features} results={state.results} tests={tests} />
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
