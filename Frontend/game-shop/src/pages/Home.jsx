import { useState } from "react";
import axios from "axios";

const Home = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  const [gameData, setGameData] = useState({
    gameName: "",
    price: "",
    description: "",
    stock: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGameData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setGameData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("gameName", gameData.gameName);
    formData.append("price", gameData.price);
    formData.append("description", gameData.description);
    formData.append("stock", gameData.stock);
    formData.append("file", gameData.image);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/games",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Game added successfully!");
      setGameData({
        gameName: "",
        price: "",
        description: "",
        stock: "",
        image: null,
      });
    } catch (error) {
      setError("Error adding the game!");
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h2>Add a New Game</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="gameName"
            placeholder="Game Name"
            value={gameData.gameName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={gameData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={gameData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={gameData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input type="file" name="file" onChange={handleFileChange} required />
        </div>
        <div>
          <button type="submit">Add Game</button>
        </div>
      </form>
    </div>
  );
};

export default Home;
