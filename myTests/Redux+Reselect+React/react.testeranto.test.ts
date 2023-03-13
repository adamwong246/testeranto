import renderer, { act } from "react-test-renderer";
import Testeranto from "testeranto";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto";

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
  testSpecifications: ITestSpecification<ITestShape, IFeatureShape>,
  testInput: Input
) =>
  Testeranto<
    ITestShape,
    Input,
    Input,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    unknown,
    IFeatureShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    { ports: 0 },
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
    }
  )
