import React from "react";
import { Row, Col, Nav, Tab } from "react-bootstrap";
import { useParams, NavLink } from "react-router-dom";

import { IMilestone, IProject, ITask, IUser } from "./TaskManTypes";

export const TaskManOwners = ({
  users,
  setModal,
  tasks,
  projects,
  milestones,
}: {
  users: IUser[],
  setModal(x: [string, string]): any,
  tasks: ITask[],
  projects: IProject[],
  milestones: IMilestone[]
}) => {

  const { id } = useParams();

  const user = users.find((u) => u._id === id)

  return (
    <Row>
      <Col sm={2}>
        <Nav variant="pills" className="flex-column">
          {users.map((user, ndx) => (
            <Nav.Item>
              <NavLink
                to={`/owners/${user._id}`}
                className="nav-link"
              >
                {user._id}
              </NavLink>
            </Nav.Item>
          ))}
        </Nav>
      </Col>
      <Col sm={10}>
        <Tab.Content>

          {user && <>

            <a href="#" onClick={() => setModal([`User`, user._id])}>
              <h1>{user._id}</h1>
            </a>

            <h2>tasks</h2>
            <ul>
              {...tasks
                .filter((u) => u.owner === user._id)
                .map((t) => {
                  return (
                    <li>
                      <a href={`/features/tasks/${t._id}`}>
                        {t.name} ({t.state})
                      </a>
                    </li>
                  );
                })}
            </ul>

            <h2>projects</h2>
            <ul>
              {...projects
                .filter((u) => u.owner === user._id)
                .map((t) => {
                  return (
                    <li>
                      <a href={`/features/projects/${t._id}`}>{t.name}</a>
                    </li>
                  );
                })}
            </ul>

            <h2>milestones</h2>
            <ul>
              {...milestones
                .filter((u) => u.owner === user._id)
                .map((t) => {
                  return (
                    <li>
                      <a href={`/features/milestones/${t._id}`}>{t.name}</a>
                    </li>
                  );
                })}
            </ul>

          </>}
          {/* {users.map((user, ndx) => {
            return (
              <Tab.Pane eventKey={`users/${user._id}`} key={ndx}>
                
              </Tab.Pane>
            );
          })} */}
        </Tab.Content>
      </Col>
    </Row>
  );
}