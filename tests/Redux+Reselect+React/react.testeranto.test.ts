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

class Suite extends BaseSuite<
  () => JSX.Element,
  () => JSX.Element,
  ReactTestRenderer,
  ReactTestRenderer,
  any
> {}

class Given extends BaseGiven<
  () => JSX.Element,
  ReactTestRenderer,
  ReactTestRenderer
> {
  givenThat(subject: () => JSX.Element) {
    let component;
    act(() => {
      component = renderer.create(subject());
    });
    return component;
  }
}

class When extends BaseWhen<ReactTestRenderer> {
  andWhen(store: renderer.ReactTestRenderer) {
    return act(() => this.actioner(store));
  }
}

class Then extends BaseThen<ReactTestRenderer, ReactTestRenderer> {
  butThen(component: renderer.ReactTestRenderer): renderer.ReactTestRenderer {
    return component;
  }
}

class Check extends BaseCheck<
  () => JSX.Element,
  ReactTestRenderer,
  ReactTestRenderer
> {
  checkThat(subject: () => JSX.Element) {
    let component;
    act(() => {
      component = renderer.create(subject());
    });
    return component;
  }
}

export class ReactTesteranto<ITestShape extends ITTestShape> extends Testeranto<
  ITestShape,
  ReactTestRenderer,
  ReactTestRenderer,
  ReactTestRenderer,
  ReactTestRenderer,
  ReactTestRenderer,
  any,
  any,
  any
> {
  constructor(
    testImplementation: ITestImplementation<any, any, any, any,ITestShape>,
    testSpecification: ITestSpecification<ITestShape>,
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
