import { createStore } from "redux";
import { Testeranto } from "testeranto";
export const ReduxTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 0 }, {
    beforeEach: function (subject, initialValues) {
        return createStore(subject, initialValues);
    },
    andWhen: function (store, actioner) {
        const a = actioner();
        return store.dispatch(a[0](a[1]));
    },
    butThen: function (store) {
        return store.getState();
    },
});
