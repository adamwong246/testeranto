import { CElement } from "react";

import { ITTestShape } from "../../../lib";
import { ITestImplementation, ITestSpecification } from "../../../Types";


export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = () => JSX.Element;
export type ISelection = CElement<any, any>
export type IStore = CElement<any, any>
export type ISubject = CElement<any, any>

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

// const TesterantoComponent = (testInput) => (props) => {
//   const myContainer = useRef(null);

//   useEffect(() => {
//     console.log(
//       "useeffectCalled"
//     );

//     props.done(myContainer.current);
//   }, []);

//   return React.createElement('div', { ref: myContainer }, testInput());  //testInput();
// };

export const testInterface = (testInput) => {
  return {
    beforeEach: async (
      x,
      ndx,
      testRsource,
      artificer
    ): Promise<IStore> => {
      return new Promise((resolve, rej) => {
        resolve(testInput())
      });
    },
    andWhen: function (s: IStore, actioner): Promise<ISelection> {
      return actioner()(s);
    },
  }
}