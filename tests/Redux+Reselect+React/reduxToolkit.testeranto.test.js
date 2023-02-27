import { createStore } from "redux";
import { Testeranto } from "testeranto";
export const ReduxToolkitTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 0 }, {
    beforeEach: (subject, initialValues) => createStore(subject.reducer, initialValues),
    andWhen: function (store, actioner) {
        const a = actioner();
        return store.dispatch(a[0](a[1]));
    },
    butThen: function (store) {
        return store.getState();
    },
    assertioner: function (t) {
        return t[0](t[1], t[2], t[3]);
    }
});
