import renderer, { act } from "react-test-renderer";

import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = Promise<JSX.Element>;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;

export type ITestImpl<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = ITestImplementation<I, O>;

export type ITestSpec<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = ITestSpecification<I, O>;

export const testInterface = {
  beforeEach: async (CComponent): Promise<renderer.ReactTestRenderer> => {
    return new Promise((res, rej) => {
      let component;
      act(async () => {
        component = renderer.create(CComponent);
      });
      res(component);
    });
  },
  andWhen: async function (
    renderer: renderer.ReactTestRenderer,
    whenCB: () => (any) => any
  ): Promise<renderer.ReactTestRenderer> {
    await act(() => whenCB()(renderer));
    return renderer;
  },
};
