import renderer, { act } from "react-test-renderer";

import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../core";

export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = Promise<JSX.Element>;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;

export type ITestImpl<
  ITestShape extends ITTestShape
> = ITestImplementation<
  InitialState,
  ISelection,
  IWhenShape,
  IThenShape,
  ITestShape
>

export type ITestSpec<
  ITestShape extends ITTestShape
> = ITestSpecification<
  ITestShape,
  ISubject,
  IStore,
  ISelection,
  IThenShape
>

export const testInterface = {
  beforeEach: async (CComponent): Promise<renderer.ReactTestRenderer> => {
    return new Promise((res, rej) => {
      let component;
      act(async () => {
        component = renderer.create(CComponent);
      });
      res(component);
    })

  },
  andWhen: async function (
    renderer: renderer.ReactTestRenderer,
    actioner: () => (any) => any
  ): Promise<renderer.ReactTestRenderer> {
    await act(() => actioner()(renderer));
    return renderer
  }
}