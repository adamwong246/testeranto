import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { ITask } from "./TaskManTypes";
import { NavLink } from "react-router-dom";

export const Features = ({
  // tasks,
  tests,
  adminMode
}: {
  // tasks: ITask[],
  tests,
  // results,
  adminMode
}) => {

  const [features, setFeatures] = useState<any[]>(
    []
  );

  const importFeatures = async () => {
    fetch('http://localhost:8080/features.json')
      .then(response => response.json())
      .then((allFeatures: any[]) => {
        setFeatures(allFeatures)
      })
  }

  useEffect(() => { importFeatures(); }, []);

  const { collection, id } = useParams();

  const feature = features.find((f) => f.filename === `${collection}/${id}`)
  // console.log(collection, id);

  if (!adminMode) return <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
    <Row>
      <Col sm={2}>
        <Nav variant="pills" className="flex-column">
          {(features).map((feature, ndx) =>

            <Nav.Item>
              <NavLink
                to={`/features/${feature.filename}`}
                className="nav-link"
              >
                {feature.filename} - {feature.name}
              </NavLink>
            </Nav.Item>

          )}
        </Nav>
      </Col>
      <Col sm={9}>
        <Tab.Content>

          {
            feature && <>
              <h1>{feature.filename}</h1>
              <h2>{feature.title}</h2>
              <h3>owner: {feature.owner}</h3>

              {
                collection === "Task" && <>
                  <h4>state: {feature.state}</h4>
                  <h4>start: {feature.start}</h4>
                  <h4>end: {feature.end}</h4>
                </>
              }

              {
                collection === "Milestone" && <>
                  <h4>date: {feature.date}</h4>
                </>
              }

              <pre>{feature.body}</pre>

              {/* <pre>{JSON.stringify(feature, null, 2)}</pre> */}
            </>
          }

        </Tab.Content>
      </Col>

    </Row>
  </Tab.Container>;



  return <div></div>
};
