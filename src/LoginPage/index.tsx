import React from "react";
import { Provider, useSelector } from "react-redux";

import app from "../app.js";

const core = app();

const selector = core.select.loginPageSelection;
export const actions = core.app.actions;
export const store = core.store;

export const noError = 'no_error';

export type ILoginPageError = 'invalidEmail' | `credentialFail` | typeof noError;

export type ILoginPageSelection = {
  password: string;
  email: string;
  error: ILoginPageError;
  disableSubmit: boolean;
};

export const emailwarning = "Something isn’t right. Please double check your email.";

export function LoginPage(): React.JSX.Element {
  const selection = useSelector(selector);

  return (<div>
    <h2>Welcome back!</h2>
    <p>Sign in and get to it.</p>

    <form>
      <input type="email" value={selection.email} onChange={(e) => store.dispatch(actions.setEmail(e.target.value as any))} />

      <p id="invalid-email-warning" className="warnin">
        {selection.error === 'invalidEmail' && emailwarning}
      </p>

      <br />

      <input type="password" value={selection.password} onChange={(e) => store.dispatch(actions.setPassword(e.target.value as any))} />

      <p id="error">
        {selection.error === 'credentialFail' && "You entered an incorrect email, password, or both."}
      </p>

      <br />

      <button disabled={selection.disableSubmit} onClick={(event) => {
        store.dispatch(actions.signIn());

      }} >Sign In</button>

    </form>

    <pre>
      {
        JSON.stringify(selection, null, 2)
      }
    </pre>

  </div>);
}

// export const LoginPage;

// eslint-disable-next-line react/display-name
export default function () {
  return <Provider store={store}>
    <LoginPage />
  </Provider>
}