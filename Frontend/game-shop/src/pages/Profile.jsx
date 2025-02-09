import React, { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider";

const Profile = () => {
  const { token, setToken } = useContext(AuthenticationContext);

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
    </div>
  );
};

export default Profile;
