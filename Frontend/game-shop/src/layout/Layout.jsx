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
            <div className="row">
              <div className="col-6 col-md-2 mb-3">
                <h5>Section</h5>
                <ul className="nav flex-column">
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Home
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Features
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Pricing
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      FAQs
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      About
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-6 col-md-2 mb-3">
                <h5>Section</h5>
                <ul className="nav flex-column">
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Home
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Features
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Pricing
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      FAQs
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      About
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-6 col-md-2 mb-3">
                <h5>Section</h5>
                <ul className="nav flex-column">
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Home
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Features
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      Pricing
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      FAQs
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a href="#" className="nav-link p-0 text-light">
                      About
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-md-5 offset-md-1 mb-3">
                <form>
                  <h5>Subscribe to our newsletter</h5>
                  <p>Monthly digest of what's new and exciting from us.</p>
                  <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                    <label for="newsletter1" className="visually-hidden">
                      Email address
                    </label>
                    <input
                      id="newsletter1"
                      type="text"
                      className="form-control"
                      placeholder="Email address"
                    />
                    <button className="btn btn-primary" type="button">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
              <p>&copy; 2024 Company, Inc. All rights reserved.</p>
              <ul className="list-unstyled d-flex">
                <li className="ms-3">
                  <a className="link-body-emphasis" href="#">
                    <svg className="bi" width="24" height="24">
                      <use xlink:href="#twitter" />
                    </svg>
                  </a>
                </li>
                <li className="ms-3">
                  <a className="link-body-emphasis" href="#">
                    <svg className="bi" width="24" height="24">
                      <use xlink:href="#instagram" />
                    </svg>
                  </a>
                </li>
                <li className="ms-3">
                  <a className="link-body-emphasis" href="#">
                    <svg className="bi" width="24" height="24">
                      <use xlink:href="#facebook" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Layout;
