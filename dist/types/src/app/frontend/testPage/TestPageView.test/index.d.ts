import "./../../../App.scss";
declare const _default: Promise<import("../../../../Web").WebTesteranto<import("testeranto-react/src/react-dom/jsx/dynamic").I, import("./types").O, {
    whens: import("../../../../Types").TestWhenImplementation<{
        iinput: import("./types").IInput;
        isubject: import("./types").ISubject;
        istore: import("./types").IStore;
        iselection: import("./types").ISelection;
        given: (props: import("./types").IInput) => import("./types").ISelection;
        when: (sel: import("./types").ISelection, tr: import("../../../../lib").ITTestResourceConfiguration, utils: import("../../../../lib/types").IPM) => Promise<(sel: import("./types").ISelection) => import("./types").ISelection>;
        then: (sel: import("./types").ISelection, tr: import("../../../../lib").ITTestResourceConfiguration, utils: import("../../../../lib/types").IPM) => Promise<(sel: import("./types").ISelection) => import("./types").ISelection>;
    }, import("./types").O>;
}>>;
export default _default;
