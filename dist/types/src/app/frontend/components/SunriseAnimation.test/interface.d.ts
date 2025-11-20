import { IInput, ISelection, ISubject } from "./types";
import { ITestAdapter } from "../../../../CoreTypes";
export declare const interface: ITestAdapter<{
    iinput: IInput;
    isubject: ISubject;
    istore: ISelection;
    iselection: ISelection;
    given: (props: IInput) => ISelection;
    when: (sel: ISelection) => ISelection;
    then: (sel: ISelection) => Promise<ISelection>;
}>;
