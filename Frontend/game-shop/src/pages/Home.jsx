import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);

      await axios
        .get("http://localhost:3000/api/v1/games/")
        .then((response) => {
          setGames(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchGames();
  }, []);

  return (
    <Container className="py-3">
      {loading ? (
        <Spinner animation="border" variant="success" />
      ) : (
        <>
          <Row className="my-3">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setFilteredGames(
                    games.filter((game) => {
                      return game.gameName
                        .toLowerCase()
                        .includes(event.target.value.toLowerCase());
                    })
                  );
                }}
              />
            </Form>
          </Row>
          <Row>
            {searchText.length > 0 ? (
              filteredGames.length === 0 ? (
                <Col>No games found.</Col>
              ) : (
                filteredGames.map((game) => {
                  return (
                    <Col key={game._id} className="my-2">
                      <Card
                        style={{ width: "18rem" }}
                        onClick={() => {
                          navigate(`/details`, { state: { id: game._id } });
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={`http://localhost:3000/images/${game.image}`}
                        />
                        <Card.Body>
                          <Card.Title>{game.gameName}</Card.Title>
                          <Card.Text>{game.price}€</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              )
            ) : (
              games.map((game) => {
                return (
                  <Col key={game._id} className="my-2">
                    <Card
                      style={{ width: "18rem" }}
                      onClick={() => {
                        navigate(`/details`, { state: { id: game._id } });
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={`http://localhost:3000/images/${game.image}`}
                      />
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          {" "}
                          <Card.Title>{game.gameName}</Card.Title>
                          <Card.Text>{game.price}€</Card.Text>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Home;
