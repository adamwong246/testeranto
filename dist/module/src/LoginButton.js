import React, { useState } from "react";
// import { ButtonGroup, Button } from "react-bootstrap";
export default () => {
    const [state, setState] = useState(false);
    return React.createElement("button", { id: "signin", onClick: () => {
            console.log("clicked");
            setState(!state);
        } },
        " ",
        state ? "Sign out" : "Log in");
};
//   <ButtonGroup className="mb-2">
//   <Button
//     id="login"
//     value="1"
//   >
//     Login
//   </Button>
// </ButtonGroup>
