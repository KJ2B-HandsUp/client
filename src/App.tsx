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
import SoloGamePage from "./pages/SingleGamePage";
import "./index.css";

function App() {
  return (
    <>
      <BrowserRouter basename="/client">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main/*" element={<MainPage />} />
          <Route path="/game/:roomId" element={<GamePage />} />
          <Route path="/sologame/:roomId" element={<SoloGamePage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <Outlet />
    </>
  );
}

export default App;
