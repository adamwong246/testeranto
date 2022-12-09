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
  ITestSpecification,
  ITTestShape,
  Testeranto,
} from "../../index";

import { ClassicalComponent } from "./ClassicalComponent";

export class ReactTestRendererTesteranto<
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  renderer.ReactTestRenderer,
  renderer.ReactTestRenderer,
  renderer.ReactTestRenderer,
  renderer.ReactTestRenderer,
  any,
  any,
  any,
  any
> {
  constructor(
    testImplementation: ITestImplementation<any, any, any, any, ITestShape>,
    testSpecification: ITestSpecification<ITestShape>,
    thing
  ) {
    super(
      testImplementation,
      /* @ts-ignore:next-line */
      testSpecification,
      thing,
      (s, g, c) =>
        new (class Suite extends BaseSuite<
          React.Component,
          any,
          any,
          any,
          any
        > {})(s, g, c),
      (n, f, w, t) =>
        new (class Given extends BaseGiven<any, any, any, any> {
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
        })(n, f, w, t),
      (s, o) =>
        new (class When<
          IStore extends renderer.ReactTestRenderer
        > extends BaseWhen<IStore, any, any> {
          payload?: any;

          constructor(name: string, actioner: (...any) => any, payload?: any) {
            super(name, (store) => actioner(store));
            this.payload = payload;
          }

          async andWhen(renderer: IStore) {
            return act(() => this.actioner(renderer));
          }
        })(s, o),
      (s, o) =>
        new (class Then extends BaseThen<
          renderer.ReactTestRenderer,
          renderer.ReactTestRenderer,
          any
        > {
          butThen(
            component: renderer.ReactTestRenderer,
            testResourceConfiguration?: any
          ): renderer.ReactTestRenderer {
            return component;
          }
          constructor(name: string, callback: (val: any) => any) {
            super(name, callback);
          }
        })(s, o),
      (n, f, cb, w, t) =>
        new (class Check extends BaseCheck<any, any, any, any> {
          async checkThat(subject) {
            let component;
            act(() => {
              component = renderer.create(subject());
            });
            return component;
          }
        })(n, f, cb, w, t)
    );
  }
}
