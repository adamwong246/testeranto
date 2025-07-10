/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactDom from "react-dom/client";
import React, { ReactNode, useEffect, useState } from "react";
import { Col, Nav, Row, Tab, Table } from "react-bootstrap";

import { Footer } from "./Footer";
import { ITestTypes, IRunTime, IBuiltConfig } from "./lib";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"
import { ISummary } from "./Types";


// type ICollation = {
//   name: string;
//   runTime: IRunTime;
//   tr: {
//     ports: number;
//   };
//   sidecars: ITestTypes[];
//   staticAnalysis: number | "?";
//   typeErrors: number | "?";
//   bddErrors: number | "?";
//   prompt: string | "?";
// };

// type ICollations = ICollation[];

const ExternalFeatures = ({ summary }: { summary: ISummaries }) => {
  return <div>

    <Row>
      <Tab.Container id="external-features-tab-container" >
        <Row>

          <Col sm={1}>
            <Nav variant="pills" className="flex-column">

              <Nav.Item>
                <Nav.Link eventKey={"log"}>
                  log
                </Nav.Link>
                <Nav.Link eventKey={"steps"}>
                  steps
                </Nav.Link>
              </Nav.Item>

            </Nav>
          </Col>

          <Col sm={11}>
            <Tab.Content>
              <Tab.Pane eventKey={"log"}>
                {/* <pre><code>{log}</code></pre> */}
              </Tab.Pane>

              <Tab.Pane eventKey={"steps"}>

                <Tab.Container id="secondary-tab-container" defaultActiveKey="first">
                  <Row>
                    <Col sm={3}>
                      <Nav variant="pills" className="flex-column">

                        {/* {
                          ...bddErrors.givens.map((g) =>
                            <Nav.Item>
                              <Nav.Link eventKey={g.key}>
                                {g.key}: Given {g.name}
                              </Nav.Link>
                            </Nav.Item>
                          )
                        } */}

                      </Nav>
                    </Col>
                    <Col sm={9}>
                      <Tab.Content>
                        {/* {
                          ...bddErrors.givens.map((g) =>

                            <Tab.Pane eventKey={g.key}><TestPane given={g} /></Tab.Pane>

                          )
                        } */}
                      </Tab.Content>
                    </Col>
                  </Row>

                </Tab.Container>
              </Tab.Pane>

            </Tab.Content>


          </Col>

          {/* <Col sm={3}>
            


          </Col>

          <Col sm={3}>
            <Nav variant="pills" className="flex-column">

              {
                ...bddErrors.givens.map((g) =>
                  <Nav.Item>
                    <Nav.Link eventKey={g.key}>
                      {g.key}: Given {g.name}
                    </Nav.Link>
                  </Nav.Item>
                )
              }

            </Nav>
          </Col>
          <Col sm={6}>
            <Tab.Content>
              {
                ...bddErrors.givens.map((g) =>

                  <Tab.Pane eventKey={g.key}><TestPane given={g} /></Tab.Pane>

                )
              }
            </Tab.Content>
          </Col> */}

        </Row>
      </Tab.Container>
    </Row>

  </div>
}

const Features = ({ summary }: { summary: ISummaries }) => {
  return <div>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>project</th>
          <th>platform</th>
          <th>BDD errors</th>
          <th>Lint errors</th>
          <th>Type errors</th>
          <th>prompt</th>
        </tr>

      </thead>

      <tbody>
        {
          ...summary.map((s) => {
            return <>
              <tr>
                <th>{s[0]}</th>
              </tr>
              {
                ...s[1].tests.map((t) => {

                  const x = `${s[0]}/${t[0].split(".").slice(0, -1).join(".")}/${t[1]}`
                  const y = s[2][t[0]];

                  return <tr>
                    <td>{t[0]}</td>
                    <td>{t[1]}</td>
                    <td><a href={`./reports/${x}/index.html`}>{y.runTimeError}</a></td>
                    <td><a href={`./reports/${x}/lint_errors.json`}>{y.staticErrors}</a></td>
                    <td><a href={`./reports/${x}/type_errors.txt`}>{y.typeErrors}</a></td>
                    <td>
                      <pre>

                        {s[2][t[0]].prompt}
                        {/* <button onClick={() => {
                        copyToClipboard(s[2][t[0]].prompt)
                      }}>prompt</button> */}
                      </pre>
                    </td>


                  </tr>
                })
              }
            </>


          })
        }
      </tbody>

    </Table>

  </div>
}

const Docs = ({ summary }: { summary: ISummaries }) => {
  return <div>


    <Tab.Container id="DocsPane-tabs" defaultActiveKey="external">
      <Row>
        <Col sm={12}>
          <Nav >
            <Nav.Link eventKey={`external`}>external</Nav.Link>
            <Nav.Link eventKey={`markdown`}>markdown</Nav.Link>
            <Nav.Link eventKey={`string`}>string</Nav.Link>
          </Nav>
        </Col>
      </Row>
      <Row>


        <Col sm={12}>
          <Tab.Content>

            <Tab.Pane eventKey={`external`}>
              <ExternalFeatures summary={summary} />
            </Tab.Pane>


            <Tab.Pane eventKey={`markdown`}>
              <ExternalFeatures summary={summary} />
            </Tab.Pane>

            <Tab.Pane eventKey={`string`}>
              <ExternalFeatures summary={summary} />
            </Tab.Pane>

          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>

  </div>
}

type ISummaries = [
  string,
  IBuiltConfig,
  ISummary
][];

const BigBoard = () => {

  const bigConfigElement = document.getElementById('bigConfig');
  if (!bigConfigElement) throw new Error('bigConfig element not found');
  const projects = JSON.parse(bigConfigElement.innerHTML) as string[];

  const [summary, setSummary] = useState<ISummaries>();
  useEffect(() => {
    (async () => {

      const x: Promise<[string, IBuiltConfig, ISummary]>[] = projects.map(async (p) => {
        return [
          p,
          (await (await fetch(`./reports/${p}/config.json`)).json()) as IBuiltConfig,
          (await (await fetch(`./reports/${p}/summary.json`)).json()) as ISummary
        ] as [string, IBuiltConfig, ISummary]
      })

      Promise.all(x).then((v) => {
        setSummary(v)
      })

    })();
  }, []);


  if (!summary || summary?.length === 0) {
    return <div>loading...</div>
  }

  // console.log("summary", summary)
  // // const collated: ICollations = configs.tests.map((c) => {
  // //   return {
  // //     ...bigBoard[c[0]],
  // //     name: c[0],
  // //     runTime: c[1],
  // //     tr: c[2],
  // //     sidecars: c[3],
  // //     staticAnalysis: bigBoard[c[0]].staticErrors,
  // //     typeErrors: bigBoard[c[0]].typeErrors,
  // //     bddErrors: bigBoard[c[0]].runTimeError,
  // //     prompt: bigBoard[c[0]].prompt
  // //   } as ICollation
  // // });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  }


  return <div>    <Tab.Container id="TestPane-tabs" defaultActiveKey="tests">
    <Row>
      <Col sm={12}>
        <Nav >
          <Nav.Link eventKey={`tests`}>tests</Nav.Link>
          <Nav.Link eventKey={`features`}>features</Nav.Link>
          <Nav.Link eventKey={`docs`}>docs</Nav.Link>
        </Nav>
      </Col>
    </Row>
    <Row>


      <Col sm={12}>
        <Tab.Content>

          <Tab.Pane eventKey={`tests`}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>project</th>
                  <th>platform</th>
                  <th>BDD errors</th>
                  <th>Lint errors</th>
                  <th>Type errors</th>
                  <th>prompt</th>
                  <th>failing features</th>
                </tr>

              </thead>

              <tbody>
                {
                  ...summary.map((s) => {
                    return <>
                      <tr>
                        <th>{s[0]}</th>
                      </tr>
                      {
                        ...s[1].tests.map((t) => {

                          const x = `${s[0]}/${t[0].split(".").slice(0, -1).join(".")}/${t[1]}`
                          const y = s[2][t[0]];

                          return <tr>
                            <td>{t[0]}</td>
                            <td>{t[1]}</td>
                            <td><a href={`./reports/${x}/index.html`}>{y.runTimeError}</a></td>
                            <td><a href={`./reports/${x}/lint_errors.json`}>{y.staticErrors}</a></td>
                            <td><a href={`./reports/${x}/type_errors.txt`}>{y.typeErrors}</a></td>
                            <td>
                              <pre>

                                {/* {s[2][t[0]].prompt} */}
                                <button onClick={() => {
                                  copyToClipboard(s[2][t[0]].prompt)
                                }}>copy</button>
                              </pre>
                            </td>
                            <td>
                              {/* <a href={`./reports/${x}/type_errors.txt`}>{y.typeErrors}</a> */}
                              <pre><code>{JSON.stringify(y.failingFeatures, null, 2)}</code></pre>
                            </td>

                          </tr>
                        })
                      }
                    </>


                  })
                }
              </tbody>

            </Table>
          </Tab.Pane>


          <Tab.Pane eventKey={`features`}>
            <Features summary={summary} />
          </Tab.Pane>

          <Tab.Pane eventKey={`docs`}>
            <Docs summary={summary} />
          </Tab.Pane>

        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>

    <Footer />
  </div>

}

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}));
  }
});

