import renderer, { act, ReactTestRenderer } from "react-test-renderer";

import {
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
  Testeranto,
  BaseCheck,
} from "../../index";

export default <IComponent, ISS, IGS, IWS, ITS, ICheckExtensions>(
  store,
  tests: (
    Suite: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<any, any, any>[],
        checks: BaseCheck<any, any, any>[]
      ) => BaseSuite<any, any, any>
    >,
    Given: Record<
      keyof IGS,
      (
        featureReduxTook: string,
        whens: BaseWhen<any>[],
        thens: BaseThen<any>[],
        ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseGiven<any, any, any>
    >,
    When: Record<keyof IWS, any>,
    Then: Record<keyof ITS, any>
  ) => BaseSuite<any, any, any>[]
) => {
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
    },
    ICheckExtensions
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
      andWhen(store: renderer.ReactTestRenderer) {
        return act(() => this.actioner(store));
      }
    },

    class ReactThen extends BaseThen<ReactTestRenderer> {
      butThen(
        component: renderer.ReactTestRenderer
      ): renderer.ReactTestRenderer {
        return component;
      }
    },

    class ReactCheck extends BaseCheck<
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
  );
};
