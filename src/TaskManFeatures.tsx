import React, { useEffect, useState } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { ITask } from "./TaskManTypes";

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
  //     .catch (error => console.error(error));
  // };

  useEffect(() => { importFeatures(); }, []);

  if (!adminMode) return <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
    <Row>
      <Col sm={4}>
        <Nav variant="pills" className="flex-column">
          {(features).map((feature, ndx) => <Nav.Item key={ndx}>
            <Nav.Link eventKey={`feature/${feature.filename}`}>
              {feature.filename} - {feature.name}
            </Nav.Link>
          </Nav.Item>)}
        </Nav>
      </Col>
      <Col sm={8}>
        <Tab.Content>
          {(features).map((feature, ndx) => {
            // const feature = features[featureKey];
            return (
              <Tab.Pane eventKey={`feature/${feature.filename}`} key={ndx}>
                <pre>{JSON.stringify(feature, null, 2)}</pre>

                {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}



              </Tab.Pane>
            )
          }
          )}
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>;


  // return <Crud schema={featuresSchema} collectionName="features" collection={features}></Crud2>
  return <div></div>
};
