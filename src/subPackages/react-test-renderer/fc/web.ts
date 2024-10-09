import test from "../../../Web";

import React from "react";
import renderer, { act } from "react-test-renderer";

import { ITTestShape } from "../../../lib";
import { ITestSpecification, ITestImplementation } from "../../../Types";

export type IInput = React.FC;
export type IWhenShape = unknown;
export type IThenShape = unknown;

export type ISpec<ITestShape extends ITTestShape> = ITestSpecification<
  ITestShape,
  any,
  any,
  any,
  IThenShape,
  any
>
export default <
  ITestShape extends ITTestShape,
  IPropShape
>(
  testImplementations: ITestImplementation<
    IPropShape,
    renderer.ReactTestRenderer,
    IWhenShape,
    IThenShape,
    ITestShape,
    any
  >,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput
) =>
  test<
    ITestShape,
    IInput,
    any,
    renderer.ReactTestRenderer,
    unknown, unknown, unknown, unknown,
    any
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeEach: function (
        CComponent,
        props
      ): Promise<renderer.ReactTestRenderer> {

        return new Promise((res, rej) => {
          let component: renderer.ReactTestRenderer;
          act(() => {
            component = renderer.create(
              React.createElement(CComponent, props, [])
            );
            res(component);
          });

        })

      },
      andWhen: async function (
        renderer: renderer.ReactTestRenderer,
        whenCB: () => (a: any) => any
      ): Promise<renderer.ReactTestRenderer> {
        await act(() => whenCB()(renderer));
        return renderer;
      },
      afterEach: async (store, key, artificer) => {
        console.log("afterall")
        store.unmount();
      },
    }
  );
