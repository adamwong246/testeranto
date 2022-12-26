import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import { TesterantoFactory } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type TestResource = never;
type WhenShape = any;
type ThenShape = any;
type Input = () => JSX.Element;

export const ReactTesteranto = <
  ITestShape extends ITTestShape
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
  TesterantoFactory<
    ITestShape,
    Input,
    Input,
    renderer.ReactTestRenderer,
    renderer.ReactTestRenderer,
    WhenShape,
    ThenShape,
    TestResource,
    unknown
  >(
    testInput,
    testSpecifications,
    testImplementations,
    "na",
    {
      beforeEach: async function (subject: Input, initialValues: any, testResource: never): Promise<renderer.ReactTestRenderer> {
        let component;
        await act(() => {
          component = renderer.create(subject());
        });
        return component;
      },
      andWhen: async function (renderer: renderer.ReactTestRenderer, actioner: any, testResource: never): Promise<renderer.ReactTestRenderer> {
        await act(() => actioner()(renderer))
        return renderer;
      },
    }
  )
