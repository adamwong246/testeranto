import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { BaseSuite, BaseGiven, BaseWhen, BaseThen, TesterantoBasic } from '../../index';

export class ReactSuite extends
  BaseSuite<
    () => JSX.Element,  // the thing we test
    ReactTestRenderer,  // the thing we perform actions against
    ReactTestRenderer   // the thing we make assertions against
  > {
}

export class ReactGiven extends
  BaseGiven<
    () => JSX.Element,
    ReactTestRenderer,
    ReactTestRenderer
  >{

  givenThat(subject: () => JSX.Element) {
    let component;
    act(() => {
      component = renderer.create(subject());
    });
    return component;
  }
}

export class ReactWhen extends BaseWhen<ReactTestRenderer> {
  andWhen(store: renderer.ReactTestRenderer) {
    act(() => this.actioner(store));
  }
};

export class ReactThen extends BaseThen<ReactTestRenderer>{
  butThen(component: renderer.ReactTestRenderer): renderer.ReactTestRenderer {
    return component;
  }
};

export class ReactTesteranto<
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions
> extends TesterantoBasic<
  () => JSX.Element,
  any,
  any,
  any,
  any,
  any,
  any
> {

  constructor(
    suitesOverrides: Record<(keyof SuiteExtensions), (
      sometext: string,
      subject: () => JSX.Element,
      givens: ReactGiven[],
      ...xtraArgs
    ) => ReactSuite>,
    givenOverides: Record<(keyof GivenExtensions), (
      feature: string,
      whens: ReactWhen[],
      thens: ReactThen[],
      ...xtraArgs
    ) => ReactGiven>,
    whenOverides: Record<(keyof WhenExtensions), (c: any) => ReactWhen>,
    thenOverides: Record<(keyof ThenExtensions), (d: any) => ReactThen>,
  ) {
    super(
      renderer,
      suitesOverrides,
      givenOverides,
      whenOverides,
      thenOverides
    )
  }

};
