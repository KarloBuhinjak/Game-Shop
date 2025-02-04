import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const user = localStorage.getItem("token");

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav
            variant="underline"
            activeKey={selectedKey}
            onSelect={(selectedKey) => {
              setSelectedKey(selectedKey);
            }}
          >
            <Nav.Link eventKey={0}>
              <Link to={"/"} style={{ textDecoration: "none" }}>
                Home
              </Link>
            </Nav.Link>
          </Nav>
          <Nav
            variant="underline"
            activeKey={selectedKey}
            onSelect={(selectedKey) => {
              setSelectedKey(selectedKey);
            }}
          >
            {user !== null ? (
              <>
                <Nav.Link eventKey={3}>
                  <Link
                    to={"/"}
                    style={{ textDecoration: "none" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </Nav.Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {children}
    </>
  );
};

export default Layout;
