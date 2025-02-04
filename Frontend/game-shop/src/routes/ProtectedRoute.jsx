import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ adminOnly }) => {
  const user = localStorage.getItem("token");
  let claims = null;

  if (user) {
    claims = jwtDecode(user);
  }

  console.log(claims);

  return claims !== null ? (
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
