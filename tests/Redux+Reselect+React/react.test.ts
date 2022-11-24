import renderer, { act, ReactTestRenderer } from "react-test-renderer";

import {
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
  Testeranto,
} from "./../../index";

export default <IComponent, ISS, IGS, IWS, ITS>(store, tests) => {
  return Testeranto<
    ReactTestRenderer,
    ReactTestRenderer,
    ReactTestRenderer,
    ReactTestRenderer,
    ISS,
    IGS,
    IWS,
    ITS,
    {
      [IThen in keyof ITS]: (
        // arg0: ReactTestRenderer,
        /* @ts-ignore:next-line */
        ...xtrasQW: IThens[IThen]
      ) => any;
    }
  >(
    store,
    tests,

    class ReactSuite extends BaseSuite<
      () => JSX.Element, // the thing we test
      ReactTestRenderer, // the thing we perform actions against
      ReactTestRenderer // the thing we make assertions against
    > {},

    class ReactGiven extends BaseGiven<
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
    },

    class ReactWhen extends BaseWhen<ReactTestRenderer> {
      andWhen(store: renderer.ReactTestRenderer, x) {
        return act(() => this.actioner(store));
      }
    },

    class ReactThen extends BaseThen<ReactTestRenderer> {
      butThen(
        component: renderer.ReactTestRenderer
      ): renderer.ReactTestRenderer {
        return component;
      }
    }
  );
};
