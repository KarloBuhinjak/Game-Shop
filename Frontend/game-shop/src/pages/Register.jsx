import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      firstName: event.target[0].value,
      lastName: event.target[1].value,
      email: event.target[2].value,
      password: event.target[3].value,
    };

    await axios
      .post("http://localhost:3000/api/v1/users", requestBody)
      .then((response) => {
        navigate("/login");
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
          <h2 className="mb-5">Don't have an account? Create one.</h2>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasic1">
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic2">
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" />
              </Form.Group>
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
              Already have an account?{" "}
              <span
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Click here
              </span>{" "}
              to sign in.
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

export default Register;
