import renderer, { act, ReactTestRenderer } from "react-test-renderer";

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  ITestSpecification,
  ITTestShape,
  Testeranto,
} from "../../index";

type ITestResource = never;

type IWhenShape = any;
type IThenShape = any;

type IInput = () => JSX.Element;
type ISubject = () => JSX.Element;
type IState = unknown;
type IStore = ReactTestRenderer;
type ISelection = ReactTestRenderer;

export class ReactTesteranto<ITestShape extends ITTestShape> extends Testeranto<
  ITestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  ITestResource,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<IState, ISelection, IWhenShape, IThenShape, ITestShape>,
    testSpecification: ITestSpecification<ITestShape>,
    thing
  ) {
    super(
      testImplementation,
      /* @ts-ignore:next-line */
      testSpecification,
      thing,

      class Suite extends BaseSuite<
          IInput,
          ISubject,
          IStore,
          ISelection,
          IThenShape
        > { },

      class Given extends BaseGiven<
          ISubject,
          IStore,
          ISelection,
          IThenShape
        > {
          givenThat(subject: () => JSX.Element) {
            let component;
            act(() => {
              component = renderer.create(subject());
            });
            return component;
          }
        },
      
      class When extends BaseWhen<
        IStore,
        ISelection,
        IThenShape
      > {
        andWhen(store: renderer.ReactTestRenderer) {
          return act(() => this.actioner(store));
        }
      },
      
      class Then extends BaseThen<
          ISelection,
          IStore,
          IThenShape
        > {
          butThen(
            component: renderer.ReactTestRenderer
          ) {
            return component;
          }
        },
      
      class Check extends BaseCheck<
          ISubject,
          IStore,
          ISelection,
          IThenShape
        > {
          checkThat(subject: () => JSX.Element) {
            let component;
            act(() => {
              component = renderer.create(subject());
            });
            return component;
          }
        },
      
    );
  }
}
