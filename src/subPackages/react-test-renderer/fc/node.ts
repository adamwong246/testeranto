import test from "../../../Node";

import React from "react";
import renderer, { act } from "react-test-renderer";

import {
  ITTestShape,
  ITestImplementation,
  ITestSpecification
} from "../../../core";

export type IInput = React.FC;
export type IWhenShape = unknown;
export type IThenShape = unknown;

export type ISpec<ITestShape extends ITTestShape> = ITestSpecification<
  ITestShape,
  any,
  any,
  any,
  IThenShape
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
    ITestShape
  >,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput
) =>
  test<
    ITestShape,
    IInput,
    any,
    renderer.ReactTestRenderer,
    unknown, unknown, unknown, unknown
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
        actioner: () => (a: any) => any
      ): Promise<renderer.ReactTestRenderer> {
        await act(() => actioner()(renderer));
        return renderer;
      },
      afterEach: async (store, key, artificer) => {
        console.log("afterall")
        store.unmount();
      },
    }
  );
