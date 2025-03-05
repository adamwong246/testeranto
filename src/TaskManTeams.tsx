import React, { useEffect, useState } from "react";
import { Row, Col, Nav, Tab } from "react-bootstrap";
import { useParams, NavLink } from "react-router-dom";

import { IMilestone, IProject, ITask, ITeam, IUser } from "./TaskManTypes";
import { collectionEffect } from "./collectionEffect";

export const TaskManTeams = ({
  users,
  setModal,
  tasks,
  projects,
  milestones,
}: {
  users: IUser[];
  setModal(x: [string, string]): any;
  tasks: ITask[];
  projects: IProject[];
  milestones: IMilestone[];
}) => {
  const { id } = useParams();

  const [teams, setTeams] = useState<({ _id: string } & ITeam)[]>(
    []
  );
  collectionEffect(`Team`, setTeams);

  const team = teams.find((u) => u._id === id);

  return (
    <Row>
      <Col sm={2}>
        <Nav variant="pills" className="flex-column">
          {teams.map((team, ndx) => (
            <Nav.Item>
              <NavLink to={`/teams/${team._id}`} className="nav-link">
                {team.name}
              </NavLink>
            </Nav.Item>
          ))}
        </Nav>
      </Col>
      <Col sm={10}>
        <Tab.Content>
          {team && (
            <>
              <pre>{JSON.stringify(team.members, null, 2)}</pre>
            </>
          )}

        </Tab.Content>
      </Col>
    </Row>
  );
};
