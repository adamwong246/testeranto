import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import { TesterantoFactory } from "../../index";
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
    async (input) => input,
    async (subject, initialValues) => {
      let component;
      await act(() => {
        component = renderer.create(subject());
      });
      return component;
    },
    async (renderer, actioner) => {
      await act(() => actioner()(renderer))
      return renderer;
    },
    async (renderer, callback, testResource) => renderer,
    (t) => t,
    (renderer) => renderer,
    (actioner) => actioner,
  )
