import { useContext, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState("games");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      gameName: event.target[0].value,
      price: event.target[1].value,
      description: event.target[2].value,
      stock: event.target[3].value,
      file: event.target[4].files[0],
    };

    console.log(event.target[4]);
    console.log(requestBody);

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
        event.target[0].value = null;
        event.target[1].value = null;
        event.target[2].value = null;
        event.target[3].value = null;
        event.target[4].value = "";
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
        setGames(response.data.games);
      })
      .catch((errors) => {})
      .finally(() => {});
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);

      await axios
        .get("http://localhost:3000/api/v1/games")
        .then((response) => {
          setGames(response.data);
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    };

    fetchGames();
  }, [selectedKey]);

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
                                handleShow();
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
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasic1">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic2">
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" placeholder="Enter price" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter description"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic4">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control type="number" placeholder="Enter stock" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic4">
                      <Form.Label>Upload image</Form.Label>
                      <Form.Control type="file" placeholder="Upload image" />
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
        <Tab eventKey="orders" title="Orders"></Tab>
        <Tab eventKey="users" title="Users"></Tab>
      </Tabs>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasic1">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasic2">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" placeholder="Enter price" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasic3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" placeholder="Enter description" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasic4">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control type="number" placeholder="Enter stock" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasic4">
                  <Form.Label>Upload image</Form.Label>
                  <Form.Control type="file" placeholder="Upload image" />
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
          <Button variant="primary">Update</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
