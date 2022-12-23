// This file defines the test of a classical react component

import { assert } from "chai";
import React from "react";
// import http from "http";
// import puppeteer, { Page } from "puppeteer";
// import esbuild from "esbuild";
import renderer, { act, ReactTestRenderer } from "react-test-renderer";

import { TesterantoFactory } from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";
import { ClassicalComponent } from "./ClassicalComponent";

type Input = any; //[string, (string) => string];
type TestResource = "never";


type InitialState = unknown;
// type Subject = () => http.Server;
// type Store = http.Server;
// type Selection = { page: Page };
type WhenShape = any; //[url: string, paylaod: string];
type ThenShape = any;
// type Selection = { page: Page };
// type State = void;
// type Store = { page: Page };
// type Subject = { page: Page; htmlBundle: string };

export const ReactTestRendererTesteranto = <
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    InitialState,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input
) =>
  TesterantoFactory<
    ITestShape,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    any,
    any,
    any,
    any
  >(
    testInput,
    testSpecifications,
    testImplementations,
    
    async (input) => input,
    async (subject) => {
      let component;
      act(() => {
        component = renderer.create(
          React.createElement(ClassicalComponent, {}, [])
        );
      });
      return component;
    },
    // andWhen  
    async (renderer, actioner, testResource) => {
      await act(() => actioner(renderer));
      return renderer
    },
    // butThen
    async (component, callback, testResource) => {
      return component;
    },
    (t) => t,
    async (component, ndx) => component,
    (actioner) => actioner,
    "na"
  )


// import React from "react";

// import {
//   BaseCheck,
//   BaseGiven,
//   BaseSuite,
//   BaseThen,
//   BaseWhen,
//   ITestImplementation,
//   ITestSpecification,
//   ITTestShape,
//   Testeranto,
// } from "../../index";

// import { ClassicalComponent } from "./ClassicalComponent";

// export class ReactTestRendererTesteranto<
//   ITestShape extends ITTestShape
// > extends Testeranto<
//   ITestShape,
//   renderer.ReactTestRenderer,
//   renderer.ReactTestRenderer,
//   renderer.ReactTestRenderer,
//   renderer.ReactTestRenderer,
//   any,
//   any,
//   any,
//   any
// > {
//   constructor(
//     testImplementation: ITestImplementation<any, any, any, any, ITestShape>,
//     testSpecification: ITestSpecification<ITestShape>,
//     thing
//   ) {
//     super(
//       testImplementation,
//       /* @ts-ignore:next-line */
//       testSpecification,
//       thing,
//       class Suite extends BaseSuite<
//         React.Component,
//         any,
//         any,
//         any,
//         any
//       > { },
//       class Given extends BaseGiven<any, any, any, any> {
//         async givenThat(
//           subject: React.ReactElement
//         ): Promise<
//           React.ReactElement<any, string | React.JSXElementConstructor<any>>
//         > {
//           let component;
//           act(() => {
//             component = renderer.create(
//               React.createElement(ClassicalComponent, {}, [])
//             );
//           });
//           return component;
//         }
//       },
//       class When<
//         IStore extends renderer.ReactTestRenderer
//       > extends BaseWhen<IStore, any, any> {
//         payload?: any;

//         constructor(name: string, actioner: (...any) => any, payload?: any) {
//           super(name, (store) => actioner(store));
//           this.payload = payload;
//         }

//         async andWhen(renderer: IStore) {
//           return act(() => this.actioner(renderer));
//         }
//       },

//       class Then extends BaseThen<
//         renderer.ReactTestRenderer,
//         renderer.ReactTestRenderer,
//         any
//       > {
//         butThen(
//           component: renderer.ReactTestRenderer,
//           testResourceConfiguration?: any
//         ): renderer.ReactTestRenderer {
//           return component;
//         }
//         constructor(name: string, callback: (val: any) => any) {
//           super(name, callback);
//         }
//       },

//       class Check extends BaseCheck<any, any, any, any> {
//         async checkThat(subject) {
//           let component;
//           act(() => {
//             component = renderer.create(subject());
//           });
//           return component;
//         }
//       }
//     );
//   }
// }
