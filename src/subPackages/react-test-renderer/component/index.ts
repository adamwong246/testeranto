import React from "react";
import renderer, { act } from "react-test-renderer";

import { ITTestShape, ITestImplementation, ITestSpecification } from "../../../Types";

export type ISuper<T> = T extends infer U ? U : object;

export type IInput<P, S> = typeof React.Component<P, S>;
export type InitialState = unknown;
export type IWhenShape = any;
export type IThenShape = any;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;

export type IImpl<
  ITestShape extends ITTestShape,
  IReactProps,
  IReactState,
> = ITestImplementation<
  IInput<IReactProps, IReactState>,
  IReactProps,
  renderer.ReactTestRenderer,
  IWhenShape,
  IThenShape,
  ITestShape
>
export type ISpec<
  ITestShape extends ITTestShape
> = ITestSpecification<
  ITestShape,
  ISubject,
  IStore,
  ISelection,
  IThenShape
>

// export const testInterface = {
//   beforeEach: function (CComponent, props): Promise<renderer.ReactTestRenderer> {
//     return new Promise((res, rej) => {
//       let component: renderer.ReactTestRenderer;
//       act(() => {
//         component = renderer.create(
//           CComponent(props)
//         );
//         res(component);
//       });
//     });
//   },
//   andWhen: async function (
//     renderer: renderer.ReactTestRenderer,
//     actioner: () => (any) => any
//   ): Promise<renderer.ReactTestRenderer> {
//     await act(() => actioner()(renderer));
//     return renderer
//   }
// }

export const testInterface = {
  beforeEach: function (CComponent, props): Promise<renderer.ReactTestRenderer> {

    return new Promise((res, rej) => {
      act(() => {
        const x = renderer.create(new CComponent(props));
        console.log("beforeEach", x.getInstance())
        res(x);
      });
    });
  },
  andWhen: async function (
    renderer: renderer.ReactTestRenderer,
    actioner: any
  ): Promise<renderer.ReactTestRenderer> {
    // console.log("andWhen", renderer)
    await act(() => actioner()(renderer));
    return renderer
  },

  // andWhen: function (s: Store, actioner): Promise<Selection> {
  //   return actioner()(s);
  // },
  butThen: async function (s: IStore): Promise<ISelection> {

    // console.log("butThen", s)
    return s;
  },
  afterEach: async function (
    store: IStore,
    ndx,
    artificer
  ) {
    // console.log("afterEach", store);
    return {

    };
  },
  afterAll: (store: IStore, artificer) => {
    // console.log("afterAll", store);
    return;
  },

}