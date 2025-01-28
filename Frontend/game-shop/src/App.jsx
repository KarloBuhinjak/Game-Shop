import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const user = localStorage.getItem("token");
  return (
    <>
      <Router>
        <Routes>
          {user && <Route path="/" exact element={<Home />} />}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
