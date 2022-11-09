import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { TesterantoSuite, TesterantoGiven, TesterantoWhen, TesterantoThen } from '../../index';

export class ReactSuite extends
  TesterantoSuite<
    () => JSX.Element,  // the thing we test
    ReactTestRenderer,  // the thing we perform actions against
    ReactTestRenderer   // the thing we make assertions against
  > {
}

export class ReactGiven extends
  TesterantoGiven<
    () => JSX.Element,
    ReactTestRenderer,
    ReactTestRenderer
  >{

  given(subject: () => JSX.Element) {
    let component;
    act(() => {
      component = renderer.create(subject());
    });
    return component;
  }
}

export class ReactWhen extends TesterantoWhen<ReactTestRenderer> {
  when(store: renderer.ReactTestRenderer) {
    act(() => this.actioner(store));
  }
};

export class ReactThen extends TesterantoThen<ReactTestRenderer>{
  then(component: renderer.ReactTestRenderer): renderer.ReactTestRenderer {
    return component;
  }
};
