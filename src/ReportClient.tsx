import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"

import { IRunTime, ITestTypes, IBuiltConfig } from "./lib";
import { Footer } from "./Footer";
import { Table } from "react-bootstrap";

type ISummary = {
  runTimeError: number | "?";
  typeErrors: number | "?";
  staticErrors: number | "?";
  prompt: string | "?";
};

type ICollation = {
  name: string;
  runTime: IRunTime;
  tr: {
    ports: number;
  };
  sidecars: ITestTypes[];
  staticAnalysis: number | "?";
  typeErrors: number | "?";
  bddErrors: number | "?";
  prompt: string | "?";
};

type ICollations = ICollation[];

const BigBoard = () => {

  const [configs, setConfigs] = useState<IBuiltConfig>();
  useEffect(() => {
    (async () => {
      fetch(`./reports/${window.location.pathname.split('/').pop()}/config.json`)
        .then(response => response.json())
        .then(json => {
          setConfigs(json)
        })
        .catch(error => console.error(error));

    })();
  }, []);

  const [bigBoard, setBigBoard] = useState<Record<string, ISummary>>({});
  useEffect(() => {
    (async () => {
      fetch('./docs/summary.json')
        .then(response => response.json())
        .then(json => {
          setBigBoard(json)
        })
        .catch(error => console.error(error));

    })();
  }, []);

  // const [staticAnalysis, setStaticAnalysis] = useState<Record<string, string>>({});
  // useEffect(() => {
  //   (async () => {

  //     let accumulator = {};
  //     for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
  //       accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/lint_errors.txt`)).text()
  //     }
  //     setStaticAnalysis(accumulator);


  //   })();
  // }, [configs, bigBoard]);

  // const [typeErrors, setTypeErrors] = useState<Record<string, string>>({});
  // useEffect(() => {
  //   (async () => {

  //     let accumulator = {};
  //     for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
  //       accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/type_errors.txt`)).text()
  //     }
  //     setTypeErrors(accumulator);


  //   })();
  // }, [configs, bigBoard]);

  // const [bddErrors, setBddErrors] = useState<Record<string, string>>({});
  // useEffect(() => {
  //   (async () => {

  //     let accumulator = {};
  //     for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
  //       accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/bdd_errors.txt`)).text()
  //     }
  //     setBddErrors(accumulator);


  //   })();
  // }, [configs, bigBoard]);

  if (!configs) {
    return <div>loading...</div>
  }

  const collated: ICollations = configs.tests.map((c) => {
    return {
      ...bigBoard[c[0]],
      name: c[0],
      runTime: c[1],
      tr: c[2],
      sidecars: c[3],
      staticAnalysis: bigBoard[c[0]].staticErrors,
      typeErrors: bigBoard[c[0]].typeErrors,
      bddErrors: bigBoard[c[0]].runTimeError,
      prompt: bigBoard[c[0]].prompt
    } as ICollation
  });

  return <div >
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          <th>platform</th>
          <th>BDD errors</th>
          <th>Lint errors</th>
          <th>Type errors</th>
          <th>prompt</th>
        </tr>

      </thead>

      <tbody>
        {
          ...collated.map((c) => {
            return <tr>
              <td>{c.name}</td>
              <td>{c.runTime}</td>
              <td><a href={`${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/littleBoard.html`}>{c.bddErrors}</a></td>
              <td><a href={`${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/lint_errors.json`}>{c.staticAnalysis}</a></td>
              <td><a href={`${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/type_errors.txt`}>{c.typeErrors}</a></td>


              <td>
                <pre>
                  {c.prompt}
                </pre>
              </td>


            </tr>
          })
        }
      </tbody>

    </Table>
    <Footer />
  </div>
}

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}, []));
  }
});

console.log("hello ReportClient!")
