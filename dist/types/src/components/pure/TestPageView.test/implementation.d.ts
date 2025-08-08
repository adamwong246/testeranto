import { ITestImplementation } from "../../../CoreTypes";
import { O } from "./types";
export declare const implementation: ITestImplementation<{
    iinput: IInput;
    isubject: ISubject;
    istore: IStore;
    iselection: ISelection;
    given: (props: IInput) => ISelection;
    when: (sel: ISelection) => ISelection;
    then: (sel: ISelection) => Promise<ISelection>;
}, O, {}>;
