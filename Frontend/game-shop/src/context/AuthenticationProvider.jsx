import { createContext, useState } from "react";

const AuthenticationContext = createContext({
  token: null,
  setToken: () => {},
  cart: {},
  updateCart: () => {},
});

const AuthenticationProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [cart, setCart] = useState({});

  const saveToken = (newState) => {
    if (newState) {
      localStorage.setItem("token", newState);
      setToken(newState);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  const updateCart = (newState) => {
    if (newState) {
      setCart(newState);
    } else {
      setCart({});
    }
  };

  return (
    <AuthenticationContext.Provider value={{ token, setToken: saveToken, cart, updateCart }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
export { AuthenticationContext };
