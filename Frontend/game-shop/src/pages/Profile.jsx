import { useContext, useEffect, useState } from "react";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { AuthenticationContext } from "../context/AuthenticationProvider";
import Modal from "react-bootstrap/Modal";

import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const { token } = useContext(AuthenticationContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState("orders");

  const [showDetails, setShowDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleShowDetails = (order) => {
    setOrderDetails(order);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setOrderDetails(null);
  };

  let claims;

  if (token) {
    claims = jwtDecode(token);
    console.log(claims);
  }

  useEffect(() => {
    const fetchOrders = async () => {
      await axios
        .get("http://localhost:3000/api/v1/orders/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          setOrders(response.data);
          console.log(response.data);
        })
        .catch((error) => {})
        .finally(() => {});
    };

    fetchOrders();
  }, []);

  return (
    <Container className="mt-5">
      <div className="my-5">
        <div className="d-flex justify-content-center">
          <FaUserCircle size={128} />
        </div>

        <div className="text-center mt-3">
          <h6>
            {claims.firstName} {claims.lastName}
          </h6>
          <h6>{claims.email}</h6>
        </div>
      </div>

      <Tabs
        defaultActiveKey="orders"
        id="uncontrolled-tab-example"
        className="mb-3"
        onSelect={(selectedKey) => {
          setSelectedKey(selectedKey);
        }}
        activeKey={selectedKey}
      >
        <Tab eventKey="orders" title="My orders">
          <Container className="mt-5">
            {loading ? (
              <Spinner animation="border" variant="success" />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Created at</th>
                    <th>Total price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>
                        {new Date(order.createdAt)
                          .toLocaleDateString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(",", "")
                          .replaceAll("/", ".")}
                      </td>
                      <td>{order.totalPrice}€</td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <Button
                            variant="outline-success"
                            onClick={() => handleShowDetails(order)}
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Container>

          {/* MODAL ZA DETALJE */}
          <Modal
            show={showDetails}
            onHide={handleCloseDetails}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {orderDetails ? (
                <>
                  <p>
                    <strong>Order ID:</strong> {orderDetails._id}
                  </p>
                  <p>
                    <strong>Total Price:</strong> {orderDetails.totalPrice}€
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(orderDetails.createdAt).toLocaleString()}
                  </p>
                  <h5>Items:</h5>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Game Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.gameId.gameName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.gameId.price}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetails}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;
