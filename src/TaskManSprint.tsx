import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { ISprint, ITask } from "./TaskManTypes";
import { NavLink } from "react-router-dom";
import { collectionEffect } from './collectionEffect';
import { octokit } from './DELETEME';

export const Sprint = ({
  adminMode
}: {

  adminMode
}) => {

  const [sprints, setSprints] = useState<ISprint[]>(
    []
  );
  collectionEffect(`Sprint`, setSprints);

  const { id } = useParams();

  const sprint = sprints.find((f) => f._id === id)

  const [gitDiff, setGitDiff] = useState<any>({});

  useEffect(() => {
    (async () => {
      if (!sprint) return;

      const diff = await octokit.request(`GET /repos/adamwong246/kokomobay-taskman/compare/${sprint?.start}...${sprint?.end}`, {
        owner: 'adamwong246',
        repo: 'kokomobay-taskman',
        basehead: `${sprint?.start}...${sprint?.end}`,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      console.log("diff", diff)
      setGitDiff(diff);


    })();
  }, [sprint]);

  if (!adminMode) return <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
    <Row>
      <Col sm={2}>
        <Nav variant="pills" className="flex-column">
          {(sprints).map((sprint, ndx) =>
            <Nav.Item>
              <NavLink
                to={`/sprint/${sprint._id}`}
                className="nav-link"
              >
                {sprint._id}
              </NavLink>
            </Nav.Item>
          )}
        </Nav>
      </Col>
      <Col sm={9}>
        <Tab.Content>
          {
            sprint && <>
              <h1>Sprint/{sprint._id}</h1>
              <pre>{sprint.notes}</pre>
              <p>start {sprint.start}</p>
              <p>end {sprint.end}</p>

              <pre>{JSON.stringify(gitDiff, null, 2)}</pre>
            </>
          }
        </Tab.Content>
      </Col>

    </Row>
  </Tab.Container>;



  return <div></div>
};
