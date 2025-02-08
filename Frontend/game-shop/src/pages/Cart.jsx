import { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateCart } = useContext(AuthenticationContext);
  const { token } = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnClearCart = async () => {
    setLoading(true);

    await axios
      .delete("http://localhost:3000/api/v1/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        updateCart({});
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnRemoveItem = async (gameId) => {
    setLoading(true);

    await axios
      .delete(`http://localhost:3000/api/v1/cart/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (response) => {
        await axios
          .get("http://localhost:3000/api/v1/cart", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            if (response.data.items.length === 0) {
              updateCart({});
            } else {
              updateCart(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container className="mt-5">
      {loading ? (
        <Spinner animation="border" variant="success" />
      ) : (
        <>
          {cart.items && cart.items.length > 0 ? (
            <div className="d-flex justify-content-end">
              <Button
                variant="danger"
                onClick={() => {
                  handleOnClearCart();
                }}
              >
                Clear the cart
              </Button>
            </div>
          ) : (
            <></>
          )}

          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items ? (
                cart.items.length > 0 ? (
                  cart.items.map((item) => {
                    return (
                      <tr key={item.gameId._id}>
                        <td>{item.gameId.gameName}</td>
                        <td>{item.gameId.price}€</td>
                        <td>{item.quantity}</td>
                        <td>{item.quantity * item.gameId.price}€</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            onClick={() => {
                              handleOnRemoveItem(item.gameId._id);
                            }}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>There is currently no items in cart.</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )
              ) : (
                <tr>
                  <td>There is currently no items in cart.</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </Table>
          {cart.items && cart.items.length > 0 ? (
            <Row className="my-5">
              <h3>
                Total:{" "}
                {cart.items
                  ? cart.items.reduce(
                      (acc, item) => acc + item.gameId.price * item.quantity,
                      0
                    )
                  : 0}
                €
              </h3>
              <hr className="mt-3" />
              <Row className="my-3">
                <Button
                  onClick={() => {
                    navigate("/payment");
                  }}
                >
                  <h5>Checkout</h5>
                </Button>
              </Row>
            </Row>
          ) : (
            <></>
          )}
        </>
      )}
    </Container>
  );
};

export default Cart;
