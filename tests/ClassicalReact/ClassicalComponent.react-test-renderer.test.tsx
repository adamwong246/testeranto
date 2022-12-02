import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import assert from "assert";

import TesteranoFactory from "./react-test-renderer.testeranto.test";

import { ClassicalComponent } from "./ClassicalComponent";
import type { IProps, IState } from "./ClassicalComponent";

const ClassicalReactTesteranto = TesteranoFactory<
  {
    Default: string;
  },
  {
    AnEmptyState: [];
  },
  {
    IClickTheButton;
  },
  {
    ThePropsIs: [IProps];
    TheStatusIs: [IState];
  },
  {
    AnEmptyState: [];
  }
>(ClassicalComponent, (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default("idk", [
      Given.AnEmptyState("idk",
        [
          When.IClickTheButton()
        ],
        [
          Then.ThePropsIs({ "children": [] }),
          Then.TheStatusIs({ "count": 1 }),
        ]
      ),

    ], [

    ]),
  ];
});

export default async () =>
  await ClassicalReactTesteranto.run(
    {
      Default: "a default suite",
    },
    {
      AnEmptyState: () => {
        return {

        };
      },
    },
    {
      IClickTheButton: () => (component) =>
        component.root.findByType("button").props.onClick(),
    },
    {
      ThePropsIs: (expectation) => (component: renderer.ReactTestRenderer) => {
        const x = component.toJSON() as any;

        return assert.deepEqual(x.children[1], {
          type: 'pre',
          props: { id: 'theProps' },
          children: [
            JSON.stringify(expectation)
          ]
        })
      },

      TheStatusIs: (expectation) => (component) => {
        const x = component.toJSON() as any;

        return assert.deepEqual(x.children[3], {
          type: 'pre',
          props: { id: 'theState' },
          children: [
            JSON.stringify(expectation)
          ]
        })
      },
    },

    {
      AnEmptyState: () => {
        return {

        };
      },
    }
  );


// import * as ReactDOMServer from "react-dom/server";
// import { ClassicalComponent } from "./ClassicalReact/ClassicalComponent";
// import React from "react";

// const puppeteer = require("puppeteer");
// // import * as puppeteer from 'puppeteer';

// const doIt = async () => {
//   console.log("start");
//   const browser = await puppeteer.launch({
//     headless: true,
//     executablePath:
//       "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//   });
//   console.log("launched");
//   const page = await browser.newPage();
//   console.log("navigated");
//   await page.goto("https://adamwong246.github.io/resume.html");

//   const htmlContent = ReactDOMServer.renderToString(
//     React.createElement(ClassicalComponent, { foo: "hello puppeteer!" }, [])
//   );
//   await page.setContent(htmlContent);

//   console.log("navigated");
//   await page.screenshot({ path: `./dist/screenshot.jpg` });
//   console.log("done");
//   process.exit(0);
// };

// doIt();
//
