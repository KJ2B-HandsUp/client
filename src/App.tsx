import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home/*" element={<MainPage />} />
          <Route path="/game/:roomId" element={<GamePage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <Outlet />
    </>
  );
}

export default App;
