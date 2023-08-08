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
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { bgmAudio } from "./utils/audio";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    async function fetch() {
      // 기본 브금
      bgmAudio.loop = true; // 무한 반복 설정
      await bgmAudio.play(); // 음원 재생 시작
    }
    fetch();

    return () => {
      bgmAudio.pause(); // 컴포넌트 언마운트 시 음원 정지
    };
  }, []);

  return (
    <>
      <BrowserRouter basename="/">
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
