import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthenticationContext } from "../context/AuthenticationProvider";
import { jwtDecode } from "jwt-decode";

const GameDetails = () => {
  const { token } = useContext(AuthenticationContext);

  let claims;

  if (token) {
    claims = jwtDecode(token);
  }

  const { updateCart } = useContext(AuthenticationContext);

  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleAddToCart = async (gameId) => {
    if (!token) {
      navigate("/login");
    }

    const requestBody = {
      gameId: gameId,
      quantity: 1,
    };

    setIsAdding(true);

    await axios
      .post(`http://localhost:3000/api/v1/cart`, requestBody, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        updateCart(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

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
              <img src={`http://localhost:3000/images/${game.image}`} alt={game.gameName} />
            </Col>
            <Col>
              <h1>{game.gameName}</h1>
              <p>{game.description}</p>
              <p>Price: {game.price}€</p>
            </Col>
          </Row>
          {!claims.isAdmin && (
            <Row className="my-5">
              <Button
                onClick={() => {
                  handleAddToCart(game._id);
                }}
                disabled={isAdding}
              >
                Add to cart
              </Button>
            </Row>
          )}
        </Col>
      )}
    </Container>
  );
};

export default GameDetails;
