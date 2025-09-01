import { ITestImplementation } from "../../../CoreTypes";
import { IInput, ISelection, IStore, ISubject, O } from "./types";
import { ITTestResourceConfiguration, IPM } from "../../../lib";
export declare const implementation: ITestImplementation<{
    iinput: IInput;
    isubject: ISubject;
    istore: IStore;
    iselection: ISelection;
    given: (props: IInput) => ISelection;
    when: (sel: ISelection, tr: ITTestResourceConfiguration, utils: IPM) => Promise<(sel: ISelection) => ISelection>;
    then: (sel: ISelection, tr: ITTestResourceConfiguration, utils: IPM) => Promise<(sel: ISelection) => ISelection>;
}, O, {}>;
