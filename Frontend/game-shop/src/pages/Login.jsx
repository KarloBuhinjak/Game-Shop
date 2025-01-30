import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/api/v1/auth/";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login to Your Account</h1>
        <Button variant="primary" type="submit">
          Sign In
        </Button>

        <div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={data.email}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={data.password}
            required
          />
        </div>
        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
      <div>
        <h1>New Here?</h1>
        <Link to="/register">
          <button type="button">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
