import { validateEmail } from "./email";

import { IStoreState } from "../tests/Redux+Reselect+React/app";

import { ILoginPageError } from "../tests/Redux+Reselect+React/LoginPage";

function checkForErrors(storeState: IStoreState): string {
    if (validateEmail(storeState.email)) {
        return "invalidEmail";
    } else {
        if (storeState.password !== "password" && storeState.email !== "adam@email.com") {
            return "credentialFail";
        } else {
            return "no_error";
        };
    }
}

export { checkForErrors };
