import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ adminOnly }) => {
  const { token } = useContext(AuthenticationContext);

  let claims;

  if (token) {
    claims = jwtDecode(token);
  }

  return token !== null ? (
    adminOnly === true ? (
      claims.isAdmin === true ? (
        <Outlet />
      ) : (
        <Navigate to={"/unouthorized"} />
      )
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to={"/login"} />
  );
};

export default ProtectedRoute;
