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
  ITTestShape,
  Testeranto,
} from "../../index";

import { ClassicalComponent } from "./ClassicalComponent";

class Suite extends BaseSuite<React.Component, any, any, any> {}

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
    return act(() => this.actioner(renderer));
  }
}

class Then extends BaseThen<
  renderer.ReactTestRenderer,
  renderer.ReactTestRenderer
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

export class ReactTestRendererTesteranto<ITestShape extends ITTestShape> extends Testeranto<
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
    testImplementation: ITestImplementation<any, any, any, any,ITestShape>,
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
