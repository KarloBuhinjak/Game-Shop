import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthenticationContext } from "../context/AuthenticationProvider";

const GameDetails = () => {
  const { token } = useContext(AuthenticationContext);

  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);

      await axios
        .get(`http://localhost:3000/api/v1/games/${location.state.id}`)
        .then((response) => {
          setGame(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchGameDetails();
  }, []);

  return (
    <Container className="py-3 d-flex justify-content-center">
      {loading ? (
        <Spinner animation="border" variant="success" />
      ) : (
        <Col className="my-3">
          <Row>
            <Col>
              <img
                src={`http://localhost:3000/images/${game.image}`}
                alt={game.gameName}
              />
            </Col>
            <Col>
              <h1>{game.gameName}</h1>
              <p>{game.description}</p>
              <p>Price: {game.price}€</p>
            </Col>
          </Row>
          <Row className="my-5">
            <Button
              onClick={() => {
                if (token) {
                  console.log("added to cart", game._id);
                } else {
                  navigate("/login");
                }
              }}
            >
              Add to cart
            </Button>
          </Row>
        </Col>
      )}
    </Container>
  );
};

export default GameDetails;
