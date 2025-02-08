import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { AuthenticationContext } from "../context/AuthenticationProvider";

const Payment = () => {
  const [error, setError] = useState("");
  const { cart, updateCart } = useContext(AuthenticationContext);
  const { token } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    date: "",
    ccv: "",
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    if (name === "number" || name === "ccv") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.name === "" ||
      formData.number === "" ||
      formData.date === "" ||
      formData.ccv === ""
    ) {
      setError("All fields are required.");
      return;
    }

    const requestBody = {
      items: cart.items.map((item) => {
        return { gameId: item.gameId._id, quantity: item.quantity };
      }),
      totalPrice: cart.items.reduce(
        (acc, item) => acc + item.gameId.price * item.quantity,
        0
      ),
    };

    await axios
      .post("http://localhost:3000/api/v1/orders", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response) => {
        await axios
          .delete("http://localhost:3000/api/v1/cart", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            updateCart({});
            setError(null);
            setFormData({
              name: "",
              number: "",
              date: "",
              ccv: "",
            });
            navigate("/");
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((errors) => {
        setError(errors.response.data.message);
      })
      .finally(() => {});
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Col xs={6}>
        <div className="text-center">
          <h2 className="mb-5">Your games are almost in your hands.</h2>
        </div>
        <Form onSubmit={handleOnSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasic1">
                <Form.Label>Name on card</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name on card"
                  name="name"
                  value={formData.name}
                  onChange={handleOnChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic2">
                <Form.Label>Card number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter card number"
                  minLength={8}
                  maxLength={19}
                  name="number"
                  value={formData.number}
                  onChange={handleOnChange}
                />
                <Form.Text className="text-muted">
                  We'll never share payment method with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Row>
                  <Col sm={6}>
                    <Form.Label>Expiration date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter expiration date"
                      name="date"
                      value={formData.date}
                      onChange={handleOnChange}
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Label>CCV</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter CCV"
                      maxLength={3}
                      name="ccv"
                      value={formData.ccv}
                      onChange={handleOnChange}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>

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

export default Payment;
