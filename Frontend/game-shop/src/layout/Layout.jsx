import { jwtDecode } from "jwt-decode";
import { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationProvider";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const { token, setToken } = useContext(AuthenticationContext);

  let claims;

  if (token) {
    claims = jwtDecode(token);
  }

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav>
            <Nav.Link eventKey={0}>
              <Link to={"/"} style={{ textDecoration: "none" }}>
                Home
              </Link>
            </Nav.Link>
          </Nav>

          {token !== null ? (
            <Nav>
              {claims.isAdmin && (
                <Nav.Link eventKey={1}>
                  <Link to={"/dashboard"} style={{ textDecoration: "none" }}>
                    Dashboard
                  </Link>
                </Nav.Link>
              )}
              <Nav.Link eventKey={2}>
                <Link to={"/"} style={{ textDecoration: "none" }} onClick={handleLogout}>
                  Logout
                </Link>
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link eventKey={1}>
                <Link to={"/login"} style={{ textDecoration: "none" }}>
                  Login
                </Link>
              </Nav.Link>
              <Nav.Link eventKey={2}>
                <Link to={"/register"} style={{ textDecoration: "none" }}>
                  Register
                </Link>
              </Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>

      {children}
    </>
  );
};

export default Layout;
