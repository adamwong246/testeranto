import React from "react";
import renderer, { act } from "react-test-renderer";

import type {
  IBaseTest, ITestImplementation, ITestSpecification
} from "../../../Types";

export type ISuper<T> = T extends infer U ? U : object;

export type IInput<P, S> = typeof React.Component<P, S>;
export type InitialState = unknown;
export type IWhenShape = any;
export type IThenShape = any;
export type ISelection = renderer.ReactTestRenderer;
export type IStore = renderer.ReactTestRenderer;
export type ISubject = renderer.ReactTestRenderer;

export type IImpl<
  ITestShape extends IBaseTest,
  IProps
> = ITestImplementation<
  ITestShape, object
>
export type ISpec<
  ITestShape extends IBaseTest
> = ITestSpecification<
  ITestShape
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
//     whenCB: () => (any) => any
//   ): Promise<renderer.ReactTestRenderer> {
//     await act(() => whenCB()(renderer));
//     return renderer
//   }
// }



export const testInterface = {
  beforeEach: function (CComponent, propsAndChildren): Promise<renderer.ReactTestRenderer> {

    function Link(props) {
      const p = props.props;
      const c = props.children;
      return React.createElement(CComponent, p, c);
    }
    return new Promise((res, rej) => {
      act(async () => {
        const p = propsAndChildren;
        const y = new CComponent(p.props);
        const testRenderer = await renderer.create(Link(propsAndChildren));
        res(testRenderer);
      });
    });
  },
  andWhen: async function (
    renderer: renderer.ReactTestRenderer,
    whenCB: any
  ): Promise<renderer.ReactTestRenderer> {
    // console.log("andWhen", whenCB)
    await act(() => whenCB(renderer));
    return renderer
  },

  // andWhen: function (s: Store, whenCB): Promise<Selection> {
  //   return whenCB()(s);
  // },
  butThen: async function (s: IStore, thenCB, tr): Promise<ISelection> {

    console.log("butThen", thenCB.toString())
    // debugger
    return thenCB(s);
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