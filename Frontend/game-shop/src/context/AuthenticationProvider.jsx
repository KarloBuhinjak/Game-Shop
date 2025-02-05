import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";

const AuthenticationContext = createContext({
  token: null,
  setToken: () => {},
});

const AuthenticationProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const saveToken = (newState) => {
    if (newState) {
      localStorage.setItem("token", newState);
      setToken(newState);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  return (
    <AuthenticationContext.Provider value={{ token, setToken: saveToken }}>{children}</AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
export { AuthenticationContext };
