import { equal } from "assert";

import { validateEmail } from "./email";

function validateEmailValidEmailTest(): void {
    return equal(validateEmail("address@email.com"), true);
}

function validateEmailInvalidEmailTest(): void {
    return equal(validateEmail("malformedAddress"), false);
}

export { validateEmailValidEmailTest };
export { validateEmailInvalidEmailTest };
