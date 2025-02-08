import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationProvider";
import Badge from "react-bootstrap/Badge";
import axios from "axios";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const { token, setToken } = useContext(AuthenticationContext);
  const { cart, updateCart } = useContext(AuthenticationContext);

  let claims;

  if (token) {
    claims = jwtDecode(token);
  }

  const handleLogout = () => {
    updateCart({});
    setToken(null);
    navigate("/");
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        await axios
          .get("http://localhost:3000/api/v1/cart", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            console.log(response.data);
            updateCart(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    fetchCart();
  }, []);

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav>
            <Nav.Link eventKey={0}>
              <Link to={"/"} style={{ textDecoration: "none" }}>
                Game Shop
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
              {!claims.isAdmin && (
                <Nav.Link
                  eventKey={3}
                  style={{ position: "relative", marginRight: "15px" }}
                >
                  <Link
                    to={"/cart"}
                    style={{ textDecoration: "none", position: "relative" }}
                  >
                    Cart
                    <Badge
                      bg="success"
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-25px",
                      }}
                      pill
                    >
                      {cart.items && cart.items.length > 0
                        ? cart.items.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )
                        : undefined}
                    </Badge>
                  </Link>
                </Nav.Link>
              )}
              <Nav.Link eventKey={2}>
                <Link
                  to={"/"}
                  style={{ textDecoration: "none" }}
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link eventKey={1} style={{ marginRight: "15px" }}>
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

      <div className="mb-5" style={{ minHeight: "100vh" }}>
        {children}
      </div>

      <div className="bg-dark text-white">
        <div className="container py-5">
          <footer>
            <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
              <p>&copy; 2025 Game Shop, Inc. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Layout;
