import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"


import { Footer } from "./Footer";
import { Table } from "react-bootstrap";
import { ITestTypes, IRunTime, IBuiltConfig } from "./lib";


type ISummary = {
  staticAnalysis: number | "?";
  typeErrors: number | "?";
  bddErrors: number | "?";
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

  const bigConfigElement = document.getElementById('bigConfig');
  if (!bigConfigElement) throw new Error('bigConfig element not found');
  const projects = JSON.parse(bigConfigElement.innerHTML) as string[];
  // const projects = Object.keys(bigConfig.projects);

  // const [configs, setConfigs] = useState<IBuiltConfig>();
  // useEffect(() => {
  //   (async () => {
  //     fetch('/kokomoBay/docs/testeranto.json')
  //       .then(response => response.json())
  //       .then(json => {
  //         setConfigs(json)
  //       })
  //       .catch(error => console.error(error));

  //   })();
  // }, []);

  // const [bigBoard, setBigBoard] = useState<Record<string, ISummary>>({});
  // useEffect(() => {
  //   (async () => {
  //     fetch('/kokomoBay/docs/summary.json')
  //       .then(response => response.json())
  //       .then(json => {
  //         setBigBoard(json)
  //       })
  //       .catch(error => console.error(error));

  //   })();
  // }, []);


  const [summary, setSummary] = useState<[
    string,
    IBuiltConfig,
    ISummary
  ][]>();
  useEffect(() => {
    (async () => {

      const x: Promise<[string, IBuiltConfig, ISummary]>[] = projects.map(async (p) => {
        return [
          p,
          (await (await fetch(`/kokomoBay/testeranto/reports/${p}/config.json`)).json()) as IBuiltConfig,
          (await (await fetch(`/kokomoBay/testeranto/reports/${p}/summary.json`)).json()) as ISummary
        ] as [string, IBuiltConfig, ISummary]
      })

      Promise.all(x).then((v) => {
        setSummary(v)
      })

      // fetch('/kokomoBay/docs/summary.json')
      //   .then(response => response.json())
      //   .then(json => {
      //     setBigBoard(json)
      //   })
      //   .catch(error => console.error(error));

    })();
  }, []);


  if (!summary || summary?.length === 0) {
    return <div>loading...</div>
  }

  console.log("summary", summary)
  // const collated: ICollations = configs.tests.map((c) => {
  //   return {
  //     ...bigBoard[c[0]],
  //     name: c[0],
  //     runTime: c[1],
  //     tr: c[2],
  //     sidecars: c[3],
  //     staticAnalysis: bigBoard[c[0]].staticErrors,
  //     typeErrors: bigBoard[c[0]].typeErrors,
  //     bddErrors: bigBoard[c[0]].runTimeError,
  //     prompt: bigBoard[c[0]].prompt
  //   } as ICollation
  // });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  }

  return <div >

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
                    <td><a href={`/kokomoBay/testeranto/reports/${x}/littleBoard.html`}>{y.runTimeError}</a></td>
                    <td><a href={`/kokomoBay/testeranto/reports/${x}/lint_errors.json`}>{y.staticErrors}</a></td>
                    <td><a href={`/kokomoBay/testeranto/reports/${x}/type_errors.txt`}>{y.typeErrors}</a></td>
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



    <Footer />
  </div>
}

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}, []));
  }
});

console.log("hello BigBoard!")
