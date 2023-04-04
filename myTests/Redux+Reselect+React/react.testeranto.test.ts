import renderer, { act } from "react-test-renderer";
import Testeranto from "testeranto/src/core-electron";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto/src/core";

type WhenShape = any;
type ThenShape = any;
type Input = () => JSX.Element;

export const ReactTesteranto = <
  ITestShape extends ITTestShape,
  IFeatureShape,
>(
  testImplementations: ITestImplementation<
    unknown,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input
) =>
  Testeranto<
    ITestShape,
    { runtime: "just node", entrypoint: "./Rect" },
    Input,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    unknown
  >(
    { runtime: "just node", entrypoint: "./Rect" },
    testSpecifications,
    testImplementations,
    {
      beforeEach: async function (subject: Input): Promise<renderer.ReactTestRenderer> {
        let component;
        await act(() => {
          component = renderer.create(subject());
        });
        return component;
      },
      andWhen: async function (renderer: renderer.ReactTestRenderer, actioner): Promise<renderer.ReactTestRenderer> {
        await act(() => actioner()(renderer))
        return renderer;
      },

    },
    "idk"
  )
