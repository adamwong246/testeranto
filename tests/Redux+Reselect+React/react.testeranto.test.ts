import renderer, { act, ReactTestRenderer } from "react-test-renderer";

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  TesterantoV2,
} from "../../index";

class Suite extends BaseSuite<
  () => JSX.Element, // the thing we test
  ReactTestRenderer, // the thing we perform actions against
  ReactTestRenderer // the thing we make assertions against
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

class Then extends BaseThen<ReactTestRenderer> {
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

export class ReactTesteranto<ITestShape> extends TesterantoV2<
  ReactTestRenderer,
  ReactTestRenderer,
  ReactTestRenderer,
  ReactTestRenderer,
  ReactTestRenderer,
  any
> {
  constructor(
    testImplementation: ITestImplementation<any, any, any>,
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
