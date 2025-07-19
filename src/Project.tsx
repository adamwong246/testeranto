/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab, Table } from "react-bootstrap";

import { Footer } from "./Footer";
import { IBuiltConfig } from "./lib";

import "bootstrap/dist/css/bootstrap.min.css";
import { ISummary } from "./Types";

// import "./style.scss";

type ISummaries = [string, IBuiltConfig, ISummary][];

const BigBoard = () => {
  const bigConfigElement = document.getElementById("bigConfig");
  if (!bigConfigElement) throw new Error("bigConfig element not found");
  const projects = JSON.parse(bigConfigElement.innerHTML) as string[];

  const [summary, setSummary] = useState<ISummaries>();
  useEffect(() => {
    (async () => {
      const x: Promise<[string, IBuiltConfig, ISummary]>[] = projects.map(
        async (p) => {
          return [
            p,
            (await (
              await fetch(`./testeranto/reports/${p}/config.json`)
            ).json()) as IBuiltConfig,
            (await (
              await fetch(`./testeranto/reports/${p}/summary.json`)
            ).json()) as ISummary,
          ] as [string, IBuiltConfig, ISummary];
        }
      );

      Promise.all(x).then((v) => {
        setSummary(v);
      });
    })();
  }, []);

  if (!summary || summary?.length === 0) {
    return <div>loading...</div>;
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
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  }

  return (
    <div className="container-fluid">
      <Table>
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
          {...summary.map((s) => {
            return (
              <>
                <tr>
                  <th>{s[0]}</th>
                </tr>
                {...s[1].tests.map((t) => {
                  const x = `${s[0]}/${t[0]
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/${t[1]}`;
                  const y = s[2][t[0]];

                  return (
                    <tr>
                      <td>{t[0]}</td>
                      <td>{t[1]}</td>
                      <td>




                        <a
                          href={`./testeranto/reports/${x}/index.html`}
                        >

                          {
                            (y.runTimeErrors < 0) && "‼️ Tests did not complete"
                          }

                          {
                            y.runTimeErrors === 0 && "✅ All tests passed"
                          }

                          {
                            y.runTimeErrors > 0 && `⚠️ ${y.runTimeErrors} failures`
                          }

                        </a>
                      </td>
                      <td>
                        <a
                          href={`./testeranto/reports/${x}/lint_errors.json`}
                        >
                          {y.staticErrors}
                        </a>
                      </td>
                      <td>
                        <a
                          href={`./testeranto/reports/${x}/type_errors.txt`}
                        >
                          {y.typeErrors}
                        </a>
                      </td>
                      <td>
                        <pre>
                          {/* {s[2][t[0]].prompt} */}
                          <button
                            onClick={() => {
                              copyToClipboard(s[2][t[0]].prompt);
                            }}
                          >
                            copy
                          </button>
                        </pre>
                      </td>

                    </tr>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </Table>


      <Footer />

    </div>
  );
};

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}));
  }
});
