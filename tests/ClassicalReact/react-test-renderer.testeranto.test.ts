// This file defines the test of a classical react component

import React from "react";
import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  Testeranto,
} from "../../index";

import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";
import { ClassicalComponent } from "./ClassicalComponent";

class Suite extends BaseSuite<any, any, any> {}

class Given extends BaseGiven<any, any, any> {
  async givenThat(
    subject: React.ReactElement
  ): Promise<
    React.ReactElement<any, string | React.JSXElementConstructor<any>>
  > {
    let component;
    act(() => {
      component = renderer.create(
        React.createElement(ClassicalComponent, {}, [])
      );
    });
    return component;
  }
}

class When<IStore extends renderer.ReactTestRenderer> extends BaseWhen<IStore> {
  payload?: any;

  constructor(name: string, actioner: (...any) => any, payload?: any) {
    super(name, (store) => actioner(store));
    this.payload = payload;
  }

  async andWhen(renderer: IStore) {
    // console.log("mark3", renderer);
    return act(() => this.actioner(renderer));
  }
}

class Then extends BaseThen<any> {
  constructor(name: string, callback: (val: any) => any) {
    super(name, callback);
  }

  async butThen(component) {
    return component;
  }
}

class Check extends BaseCheck<any, any, any> {
  async checkThat(subject) {
    let component;
    act(() => {
      component = renderer.create(subject());
    });
    return component;
  }
}

type IAction = any;

export class ReactTestRendererTesteranto<ITestShape> extends Testeranto<
  ITestShape,
  any,
  any,
  any,
  any,
  IAction
> {
  constructor(
    testImplementation: ITestImplementation<any, any, IAction>,
    testSpecification,
    thing
  ) {
    super(
      testImplementation,
      testSpecification,
      thing,
      (s, g, c) => new Suite(s, g, c),
      (f, w, t) => new Given(f, w, t),
      (s, o) => new When(s, o),
      (s, o) => new Then(s, o),
      (f, g, c, cb) => new Check(f, g, c, cb)
    );
  }
}

// export default <ISS, IGS, IWS, ITS, ICheckExtensions>(
//   reactComponent: typeof React.Component,
//   tests: (
//     Suite: Record<
//       keyof ISS,
//       (
//         name: string,
//         givens: BaseGiven<any, any, any>[],
//         checks: BaseCheck<any, any, any>[]
//       ) => BaseSuite<any, any, any>
//     >,
//     Given: Record<
//       keyof IGS,
//       (
//         feature: string,
//         whens: BaseWhen<any>[],
//         thens: BaseThen<any>[],
//         ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
//       ) => BaseGiven<any, any, any>
//     >,
//     When: Record<keyof IWS, any>,
//     Then: Record<keyof ITS, any>,

//     Check: Record<
//       keyof ICheckExtensions,
//       (
//         feature: string,
//         callback: (whens, thens) => any,
//         ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
//       ) => BaseCheck<any, any, any>
//     >
//   ) => BaseSuite<any, any, any>[]
// ) => {
//   return Testeranto<
//     any,
//     any,
//     any,
//     any,
//     ISS,
//     IGS,
//     IWS,
//     ITS,
//     // ISimpleThensForRedux<ITS>,
//     ICheckExtensions
//   >(
//     reactComponent,
//     tests,
//     class ClassicalReactSuite extends BaseSuite<any, any, any> {},

//     class ClassicalReactGiven extends BaseGiven<any, any, any> {
//       async givenThat(
//         subject: React.ReactElement
//       ): Promise<
//         React.ReactElement<any, string | React.JSXElementConstructor<any>>
//       > {
//         let component;
//         act(() => {
//           component = renderer.create(
//             React.createElement(reactComponent, {}, [])
//           );
//         });
//         return component;
//       }

//       // async teardown(renderer: renderer.ReactTestRenderer) {
//       //   // const browser = await puppeteer.launch({
//       //   //   headless: true,
//       //   //   executablePath:
//       //   //     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//       //   // });
//       //   // const page = await browser.newPage();
//       //   // // const htmlContent = ReactDOMServer.renderToString(
//       //   // //   renderer.toTree()?.instance
//       //   // // );
//       //   // const elem: React.ReactElement = React.createElement(
//       //   //   renderer.toTree()?.instance
//       //   // );
//       //   // console.log("elem", elem);
//       //   // console.log(render(elem));
//       //   // // const htmlContent = ReactDOMServer.renderToString(elem);
//       //   // // console.log("htmlContent", htmlContent);
//       //   // process.exit(-1);
//       //   // // await page.setContent(htmlContent);
//       //   // // await page.screenshot({ path: `./dist/hello react screenshot.jpg` });
//       //   // return {};
//       // }
//     },

//     class ClassicalReactWhen<
//       IStore extends renderer.ReactTestRenderer
//     > extends BaseWhen<IStore> {
//       payload?: any;

//       constructor(name: string, actioner: (...any) => any, payload?: any) {
//         super(name, (store) => actioner(store));
//         this.payload = payload;
//       }

//       async andWhen(renderer: IStore) {
//         return act(() => this.actioner(renderer));
//       }
//     },

//     class ClassicalReactThen extends BaseThen<any> {
//       constructor(name: string, callback: (val: any) => any) {
//         super(name, callback);
//       }

//       async butThen(component) {
//         return component;
//       }
//     },

//     class ClassicalReactCheck extends BaseCheck<any, any, any> {
//       async checkThat(subject) {
//         let component;
//         act(() => {
//           component = renderer.create(subject());
//         });
//         return component;
//       }
//     }
//   );
// };
