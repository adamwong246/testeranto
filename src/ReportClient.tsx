import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import 'bootstrap/dist/css/bootstrap.min.css';
import { IBuiltConfig, IRunTime, ITestTypes } from "./lib/types";

type ICollation = {
  name: string;
  runTime: IRunTime;
  tr: {
    ports: number;
  };
  sidecars: ITestTypes[];
  status: string;
  runTimeError: number;
  staticAnalysis: string;
};

type ICollations = ICollation[];

const TestPane = ({ collation }: { collation: ICollation }) => {

  return <div>    <Tab.Container id="TestPane-tabs" defaultActiveKey="first">
    <Row>
      <Col sm={3}>
        <Nav variant="pills" className="flex-column">

          <Nav.Item>
            <Nav.Link eventKey={`${collation.name}-bdd`}>BDD tests</Nav.Link>
            <Nav.Link eventKey={`${collation.name}-type`}>type tests</Nav.Link>
            <Nav.Link eventKey={`${collation.name}-static`}>static tests</Nav.Link>
          </Nav.Item>

        </Nav>
      </Col>
      <Col sm={9}>
        <Tab.Content>
          <Tab.Pane eventKey={`${collation.name}-bdd`}>BDD</Tab.Pane>
          <Tab.Pane eventKey={`${collation.name}-type`}>TYPE</Tab.Pane>
          <Tab.Pane eventKey={`${collation.name}-static`}>
            <pre>{collation.staticAnalysis}</pre>
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container></div>
}

const BigBoard = () => {

  const [configs, setConfigs] = useState<IBuiltConfig>();
  useEffect(() => {
    (async () => {
      fetch('http://localhost:8080/testeranto.json')
        .then(response => response.json())
        .then(json => {
          setConfigs(json)
        })
        .catch(error => console.error(error));

    })();
  }, []);

  const [bigBoard, setBigBoard] = useState<Record<string, object>>({});
  useEffect(() => {
    (async () => {
      fetch('http://localhost:8080/bigBoard.json')
        .then(response => response.json())
        .then(json => {
          setBigBoard(json)
        })
        .catch(error => console.error(error));

    })();
  }, []);

  const [staticAnalysis, setStaticAnalysis] = useState<Record<string, string>>({});
  useEffect(() => {
    (async () => {

      let accumulator = {};
      for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
        accumulator[t[0]] = await (await fetch(`http://localhost:8080/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/lint_errors.txt`)).text()
      }
      setStaticAnalysis(accumulator);


    })();
  }, [configs, bigBoard]);

  if (!configs || !staticAnalysis) {
    return <div>loading...</div>
  }

  const collated: ICollations = configs.tests.map((c) => {
    return {
      ...bigBoard[c[0]],
      name: c[0],
      runTime: c[1],
      tr: c[2],
      sidecars: c[3],
      staticAnalysis: staticAnalysis[c[0]]
    } as ICollation
  });

  console.log(collated);

  return <div>    <Tab.Container id="root-tab-container" defaultActiveKey="first">
    <Row>
      <Col sm={3}>
        <Nav variant="pills" className="flex-column">

          {
            collated.map((t) =>
              <Nav.Item>
                <Nav.Link eventKey={t.name}>
                  <p>{t.name}</p>
                  <p>{t.status}, {t.runTimeError}</p>

                </Nav.Link>
              </Nav.Item>
            )
          }

        </Nav>
      </Col>
      <Col sm={9}>
        <Tab.Content>
          {
            collated.map((t) =>

              <Tab.Pane eventKey={t.name}><TestPane collation={t} /></Tab.Pane>

            )
          }
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container></div>
}

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}, []));
  }
});

console.log("hello BigBoard!")