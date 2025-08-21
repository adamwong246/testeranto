import "./../../../App.scss";
declare const _default: Promise<import("../../../lib/core").default<import("testeranto-react/src/react-dom/jsx/dynamic").I, import("./types").O, Omit<{
    suites: import("../../../Types").TestSuiteImplementation<import("./types").O>;
    givens: import("../../../Types").TestGivenImplementation<{
        iinput: import("./types").IInput;
        isubject: import("./types").ISubject;
        istore: import("./types").IStore;
        iselection: import("./types").ISelection;
        given: (props: import("./types").IInput) => import("./types").ISelection;
        when: (sel: import("./types").ISelection, tr: import("../../../lib").ITTestResourceConfiguration, utils: IPM) => Promise<(sel: import("./types").ISelection) => import("./types").ISelection>;
        then: (sel: import("./types").ISelection, tr: import("../../../lib").ITTestResourceConfiguration, utils: IPM) => Promise<(sel: import("./types").ISelection) => import("./types").ISelection>;
    }, import("./types").O>;
    whens: import("../../../Types").TestWhenImplementation<{
        iinput: import("./types").IInput;
        isubject: import("./types").ISubject;
        istore: import("./types").IStore;
        iselection: import("./types").ISelection;
        given: (props: import("./types").IInput) => import("./types").ISelection;
        when: (sel: import("./types").ISelection, tr: import("../../../lib").ITTestResourceConfiguration, utils: IPM) => Promise<(sel: import("./types").ISelection) => import("./types").ISelection>;
        then: (sel: import("./types").ISelection, tr: import("../../../lib").ITTestResourceConfiguration, utils: IPM) => Promise<(sel: import("./types").ISelection) => import("./types").ISelection>;
    }, import("./types").O>;
    thens: import("../../../Types").TestThenImplementation<{
        iinput: import("./types").IInput;
        isubject: import("./types").ISubject;
        istore: import("./types").IStore;
        iselection: import("./types").ISelection;
        given: (props: import("./types").IInput) => import("./types").ISelection;
        when: (sel: import("./types").ISelection, tr: import("../../../lib").ITTestResourceConfiguration, utils: IPM) => Promise<(sel: import("./types").ISelection) => import("./types").ISelection>;
        then: (sel: import("./types").ISelection, tr: import("../../../lib").ITTestResourceConfiguration, utils: IPM) => Promise<(sel: import("./types").ISelection) => import("./types").ISelection>;
    }, import("./types").O>;
}, never>>>;
export default _default;
