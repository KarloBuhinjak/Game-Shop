import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationProvider";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setToken, updateCart } = useContext(AuthenticationContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      email: event.target[0].value,
      password: event.target[1].value,
    };

    await axios
      .post("http://localhost:3000/api/v1/auth/", requestBody)
      .then(async (response) => {
        setToken(response.data.data);
        if (response.data.data) {
          await axios
            .get("http://localhost:3000/api/v1/cart", {
              headers: { Authorization: `Bearer ${response.data.data}` },
            })
            .then((response) => {
              updateCart(response.data);
              navigate("/");
              toast.success("Logged in.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
              });
            })
            .catch((error) => {
              if (error.response.status === 404) {
                toast.success("Logged in.", {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                  theme: "light",
                });
                //cart not foud, redirect to homepage
                navigate("/");
              }
            });
        }
      })
      .catch((error) => {
        setError(error.response.data.message);
      })
      .finally(() => {});
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Col xs={6}>
        <div className="text-center">
          <h2 className="mb-5">Welcome! Please sign in.</h2>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
            </Col>
          </Row>
          <div className="my-2 d-flex justify-content-center">
            <p>
              You don't have an account yet?{" "}
              <span
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  navigate("/register");
                }}
              >
                Click here
              </span>{" "}
              to create one.
            </p>
          </div>
          {error && (
            <Row className="my-2">
              <div className="text-center">
                <Alert variant={"danger"}>{error}</Alert>
              </div>
            </Row>
          )}
          <Row>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Row>
        </Form>
      </Col>
    </Container>
  );
};

export default Login;
