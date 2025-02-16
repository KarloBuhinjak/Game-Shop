import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { AuthenticationContext } from "../context/AuthenticationProvider";
import Modal from "react-bootstrap/Modal";

const AdminDashboard = () => {
  const { token } = useContext(AuthenticationContext);
  const [error, setError] = useState("");
  const [games, setGames] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState("games");
  const [show, setShow] = useState(false);

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

  const [formData, setFormData] = useState({
    gameName: "",
    price: "",
    description: "",
    stock: "",
    file: null,
  });

  const [updatingGameId, setUpdatingGameId] = useState(null);

  const fileInputRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setFormData({
      gameName: "",
      price: "",
      description: "",
      stock: "",
      file: null,
    });
    // Reset file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleShow = () => setShow(true);

  const handleOnChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdate = async (game) => {
    setUpdatingGameId(game._id);
    setFormData({
      gameName: game.gameName,
      price: game.price,
      description: game.description,
      stock: game.stock,
      file: null,
    });
    handleShow();
  };

  const handleSubmitCreate = async (event) => {
    event.preventDefault();

    const requestBody = {
      gameName: formData.gameName,
      price: formData.price,
      description: formData.description,
      stock: formData.stock,
      file: formData.file,
    };

    await axios
      .post("http://localhost:3000/api/v1/games", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setSelectedKey("games");
        setError(null);
        setFormData({
          gameName: "",
          price: "",
          description: "",
          stock: "",
          file: null,
        });

        // Reset file input field
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setGames(response.data.games.filter((game) => game.isActive));
      })
      .catch((errors) => {
        setError(errors.response.data.error);
      })
      .finally(() => {});
  };

  const handleSubmitUpdate = async (event) => {
    event.preventDefault();

    const requestBody = {
      gameName: formData.gameName,
      price: formData.price,
      description: formData.description,
      stock: formData.stock,
      file: formData.file,
    };

    await axios
      .put(
        "http://localhost:3000/api/v1/games/" + updatingGameId,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setSelectedKey("games");
        setError(null);
        setFormData({
          gameName: "",
          price: "",
          description: "",
          stock: "",
          file: null,
        });
        setUpdatingGameId(null);

        // Reset file input field
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setGames(response.data.games.filter((game) => game.isActive));

        handleClose();
      })
      .catch((errors) => {
        setError(errors.response.data.error);
      })
      .finally(() => {});
  };

  const handleDelete = async (id) => {
    await axios
      .delete("http://localhost:3000/api/v1/games/" + id)
      .then((response) => {
        setGames(response.data.games.filter((game) => game.isActive));
      })
      .catch((errors) => {
        console.log(errors);
      })
      .finally(() => {});
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);

      await axios
        .get("http://localhost:3000/api/v1/games")
        .then((response) => {
          setGames(response.data.filter((game) => game.isActive));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const fetchOrders = async () => {
      await axios
        .get("http://localhost:3000/api/v1/orders", {
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

    const fetchUsers = async () => {
      await axios
        .get("http://localhost:3000/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          setUsers(response.data);
          console.log(response.data);
        })
        .catch((error) => {})
        .finally(() => {});
    };

    fetchGames();
    fetchOrders();
    fetchUsers();
  }, []);

  return (
    <Container className="mt-5">
      <Tabs
        defaultActiveKey="games"
        id="uncontrolled-tab-example"
        className="mb-3"
        onSelect={(selectedKey) => {
          setSelectedKey(selectedKey);
        }}
        activeKey={selectedKey}
      >
        <Tab eventKey="games" title="Games">
          <Container className="mt-5">
            {loading ? (
              <Spinner animation="border" variant="success" />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Created at</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => {
                    return (
                      <tr key={game._id}>
                        <td>{game.gameName}</td>
                        <td>
                          {new Date(game.createdAt)
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
                        <td>{game.price}€</td>
                        <td>{game.stock}</td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <Button
                              variant="outline-success"
                              onClick={() => {
                                handleUpdate(game);
                              }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => {
                                handleDelete(game._id);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Container>
        </Tab>
        <Tab eventKey="new" title="Add new">
          <Container className="my-5 d-flex justify-content-center">
            <Col xs={6}>
              <Form onSubmit={handleSubmitCreate}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasic1">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="gameName"
                        value={formData.gameName}
                        onChange={handleOnChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic2">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        name="price"
                        value={formData.price}
                        onChange={handleOnChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter description"
                        name="description"
                        value={formData.description}
                        onChange={handleOnChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic4">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleOnChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic4">
                      <Form.Label>Upload image</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Upload image"
                        name="file"
                        onChange={handleOnChange}
                        ref={fileInputRef}
                      />
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
                <Row className="my-2">
                  <Button variant="primary" type="submit">
                    Add game
                  </Button>
                </Row>
              </Form>
            </Col>
          </Container>
        </Tab>
        <Tab eventKey="orders" title="Orders">
          <Container className="mt-5">
            {loading ? (
              <Spinner animation="border" variant="success" />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Created at</th>
                    <th>Customer name</th>
                    <th>Total price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
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
                      <td>
                        {order.customer.firstName} {order.customer.lastName}
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
                    <strong>Order ID:</strong> {orderDetails.orderId}
                  </p>
                  <p>
                    <strong>Customer:</strong> {orderDetails.customer.firstName}{" "}
                    {orderDetails.customer.lastName}
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
                          <td>{item.gameName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}€</td>
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
        <Tab eventKey="users" title="Users">
          <Container className="mt-5">
            {loading ? (
              <Spinner animation="border" variant="success" />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>User name</th>
                    <th>User email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    return (
                      <tr key={user._id}>
                        <td>
                          {user.firstName} {user.lastName}
                        </td>
                        <td>{user.email}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Container>
        </Tab>
      </Tabs>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update selected game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitUpdate} id="updateForm">
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasic1">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="gameName"
                    value={formData.gameName}
                    onChange={handleOnChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasic2">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    name="price"
                    value={formData.price}
                    onChange={handleOnChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasic3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter description"
                    name="description"
                    value={formData.description}
                    onChange={handleOnChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasic4">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleOnChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasic4">
                  <Form.Label>Upload image</Form.Label>
                  <Form.Control
                    type="file"
                    placeholder="Upload image"
                    name="file"
                    onChange={handleOnChange}
                    ref={fileInputRef}
                  />
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" form="updateForm">
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
