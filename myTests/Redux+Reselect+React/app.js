// import { createSelector, createSlice, createStore } from "@reduxjs/toolkit";
import pkg from '@reduxjs/toolkit';
const { createSelector, createSlice, createStore } = pkg;
export const loginApp = createSlice({
    name: "login app",
    initialState: {
        password: "",
        email: "",
        error: "no_error",
    },
    reducers: {
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        signIn: (state) => {
            state.error = checkForErrors(state);
        },
    },
});
const selectRoot = (storeState) => {
    return storeState;
};
// https://stackoverflow.com/a/46181/614612
const validateEmail = (email) => {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
const checkForErrors = (storeState) => {
    if (!validateEmail(storeState.email)) {
        return "invalidEmail";
    }
    if (storeState.password !== "password" &&
        storeState.email !== "adam@email.com") {
        return "credentialFail";
    }
    return "no_error";
};
const loginPageSelection = createSelector([selectRoot], (root) => {
    return Object.assign(Object.assign({}, root), { disableSubmit: root.email == "" || root.password == "" });
});
export default () => {
    const store = createStore(loginApp.reducer);
    return {
        app: loginApp,
        select: {
            loginPageSelection,
        },
        store,
    };
};
