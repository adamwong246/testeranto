
import { ReactFlow } from '@xyflow/react';
import { Button, ButtonGroup, Container, Dropdown, DropdownButton, Form, Navbar, NavDropdown, Table, ToggleButton } from "react-bootstrap";

import React, { useEffect, useState } from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import { IUser } from './TaskManTypes';

const InputElementString = ({ tree, name }: { tree: any, name: string }) => {
  console.log("mark string", tree)

  // return <Form.Control type="email" placeholder={name} />
  return <Form.Group className="mb-3" controlId={name}>
    <Form.Label>{name}</Form.Label>
    <Form.Control placeholder={name} />

  </Form.Group>
};

const InputElementArray = ({ tree, name }: { tree: any, name: string }) => {
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


const InputForm = ({ schema, path }: { schema: any, path?: string }) => {

  return <Form.Group>

    <InputElementObject tree={schema.toJSONSchema()}  ></InputElementObject>


  </Form.Group>

};

const Crud2 = ({ collection, collectionName, schema }: { collection: any, collectionName: string, schema: any }) => {
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

export const ChatCat = ({ children }: {
  children: any,
  chatCatRooms: ({ _id: string })[],// & IChatCatRoom)[],
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

export const WhoThat = ({ children }: {
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




export const Users = ({ users, adminMode }) => {
  if (!adminMode) return <Tab.Container id="left-tabs-example9" defaultActiveKey="feature-0">
    <Row>
      <Col sm={12}>
        <ul>
          {
            users.map((user) => {
              return <li>
                {user.name}
              </li>
            })
          }
        </ul>
      </Col>
    </Row>
  </Tab.Container>

  // return <Crud2 schema={userSchema} collectionName="users" collection={users} ></Crud2>
  return <div></div>

};

export const OrgChart = ({ users, adminMode }) => {

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

  // return <Crud2 schema={userSchema} collectionName="users" collection={users} ></Crud2>
  return <div></div>

};

export const DocGalFsNav = ({ docGalFs, filepath }: {
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

export const DocGalFs = ({
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

export const DocGalDb = ({
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

export const ChatCatPeople = ({ users }) => {
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

export const ChatCatConversations = ({ users, conversations }: {
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

export const ChatCatRooms = ({ users, rooms }) => {
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