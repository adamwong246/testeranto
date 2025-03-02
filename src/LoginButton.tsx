import React, { useState } from "react";

interface LoginButtonProps {
  initialLoggedIn?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ initialLoggedIn = false }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);

  const handleClick = () => {
    console.log("Login button clicked");
    setIsLoggedIn(prev => !prev);
  };

  return (
    <button 
      id="signin" 
      onClick={handleClick}
      className="btn btn-primary"
    >
      {isLoggedIn ? "Sign out" : "Log in"}
    </button>
  );
};

export default LoginButton;
