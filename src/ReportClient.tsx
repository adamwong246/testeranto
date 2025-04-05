import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import { IRunTime, ITestTypes, IBuiltConfig } from "./lib";


type ICollation = {
  name: string;
  runTime: IRunTime;
  tr: {
    ports: number;
  };
  sidecars: ITestTypes[];
  status: string;
  staticAnalysis: string;
  typeErrors: string;
  bddErrors: string;
};

type ICollations = ICollation[];

const BigBoard = () => {

  const [configs, setConfigs] = useState<IBuiltConfig>();
  useEffect(() => {
    (async () => {
      fetch('/kokomoBay/docs/testeranto.json')
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
      fetch('/kokomoBay/docs/bigBoard.json')
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
        accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/lint_errors.txt`)).text()
      }
      setStaticAnalysis(accumulator);


    })();
  }, [configs, bigBoard]);

  const [typeErrors, setTypeErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    (async () => {

      let accumulator = {};
      for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
        accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/type_errors.txt`)).text()
      }
      setTypeErrors(accumulator);


    })();
  }, [configs, bigBoard]);

  const [bddErrors, setBddErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    (async () => {

      let accumulator = {};
      for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
        accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/bdd_errors.txtestReport.css`)).text()
      }
      setBddErrors(accumulator);


    })();
  }, [configs, bigBoard]);

  if (!configs || !staticAnalysis || !typeErrors || !bddErrors) {
    return <div>loading...</div>
  }

  const collated: ICollations = configs.tests.map((c) => {
    return {
      ...bigBoard[c[0]],
      name: c[0],
      runTime: c[1],
      tr: c[2],
      sidecars: c[3],
      staticAnalysis: staticAnalysis[c[0]],
      typeErrors: typeErrors[c[0]],
      bddErrors: bddErrors[c[0]],
    } as ICollation
  });

  return <div >
    <table>
      <tr>
        <td>name</td>
        <td>run time</td>
        <td>BDD errors</td>
        <td>Lint errors</td>
        <td>Type errors</td>
        <td>prompt</td>
      </tr>
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
                aider --model deepseek/deepseek-chat --load {`docs/${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/prompt.txt`}
              </pre>
            </td>


          </tr>
        })
      }
    </table>
    <footer>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto </a></footer>
  </div>
}

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}, []));
  }
});

console.log("hello BigBoard!")