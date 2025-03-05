import React, { useState } from "react";
const LoginButton = ({ initialLoggedIn } = { initialLoggedIn: false }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
    const handleClick = () => {
        console.log("Login button clicked");
        setIsLoggedIn(prev => !prev);
    };
    return (React.createElement("button", { id: "signin", onClick: handleClick, className: "btn btn-primary" }, isLoggedIn ? "Sign out" : "Log in"));
};
export default LoginButton;
