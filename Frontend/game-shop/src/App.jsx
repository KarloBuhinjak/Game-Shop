import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import GameDetails from "./pages/GameDetails";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/details"
            element={
              <Layout>
                <GameDetails />
              </Layout>
            }
          />

          <Route element={<ProtectedRoute adminOnly={false} />}>
            <Route
              path="/protected"
              exact
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route
              path="/dashboard"
              exact
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
