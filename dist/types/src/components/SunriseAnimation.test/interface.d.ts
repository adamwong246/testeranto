import { IInput, ISelection, ISubject } from './types';
import { ITestInterface } from "../../CoreTypes";
export declare const interface: ITestInterface<{
    iinput: IInput;
    isubject: ISubject;
    istore: ISelection;
    iselection: ISelection;
    given: (props: IInput) => ISelection;
    when: (sel: ISelection) => ISelection;
    then: (sel: ISelection) => Promise<ISelection>;
}>;
