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
      .post(`http://localhost:3000/api/v1/cart`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
    <Container className="d-flex justify-content-center">
      {loading ? (
        <Spinner animation="border" variant="success" />
      ) : (
        <Row>
          <Col sm={12}>
            <img
              src={`http://localhost:3000/images/${game.image}`}
              alt={game.gameName}
              className="details-image"
            />
          </Col>
          <Col sm={12} className="my-2">
            <h1>{game.gameName}</h1>
          </Col>
          <Col sm={12} className="my-2">
            <h4>Game description</h4>
            <p>{game.description}</p>
          </Col>
          <Col sm={12} className="my-2">
            <h4>Configurations</h4>
            <Row>
              <Col sm={6}>
                <h5>Minimum</h5>
                <Row>
                  <Col sm={3}>
                    <p>OS:</p>
                    <p>Processor:</p>
                    <p>Memory:</p>
                    <p>Graphics:</p>
                    <p>DirectX:</p>
                    <p>Storage:</p>
                    <p>Sound Card:</p>
                    <p>Additional Notes:</p>
                  </Col>
                  <Col sm={9}>
                    <p>
                      OS 64-bit Windows 7 or 64-bit Windows 8 (8.1) or Windows
                      10
                    </p>
                    <p>
                      Intel CPU Core i5-2500K 3.3GHz, AMD CPU Phenom II X4 940
                    </p>
                    <p>8 GB RAM</p>
                    <p>Nvidia GPU GeForce GTX 660, AMD GPU Radeon HD 7870 </p>
                    <p>Version 11 </p>
                    <p>70 GB available space</p>
                    <p>Integrated </p>
                    <p>SSD recommended</p>
                  </Col>
                </Row>
              </Col>
              <Col sm={6}>
                <h5>Recommended</h5>
                <Row>
                  <Col sm={3}>
                    <p>OS:</p>
                    <p>Processor:</p>
                    <p>Memory:</p>
                    <p>Graphics:</p>
                    <p>DirectX:</p>
                    <p>Storage:</p>
                    <p>Sound Card:</p>
                    <p>Additional Notes:</p>
                  </Col>
                  <Col sm={9}>
                    <p>
                      OS 64-bit Windows 7 or 64-bit Windows 8 (8.1) or Windows
                      10
                    </p>
                    <p>
                      Intel CPU Core i7 3770 3,4 GHz, AMD CPU AMD FX-8350 4 GHz
                    </p>
                    <p>16 GB RAM</p>
                    <p>Nvidia GPU GeForce GTX 1060, AMD GPU Radeon RX 580 </p>
                    <p>Version 11 </p>
                    <p>90 GB available space</p>
                    <p>Creative SOUND BLASTER Zx </p>
                    <p>SSD recommended</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          {!claims?.isAdmin && (
            <Row className="my-5">
              <Button
                onClick={() => {
                  handleAddToCart(game._id);
                }}
                disabled={isAdding}
              >
                <h5>Add to cart</h5>
              </Button>
            </Row>
          )}
        </Row>
      )}
    </Container>
  );
};

export default GameDetails;
