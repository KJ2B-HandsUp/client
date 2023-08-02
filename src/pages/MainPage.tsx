import { Routes, Route, Navigate } from "react-router-dom";
import RoomListPage from "./RoomListPage";
import RankingPage from "./RankingPage";
import SettingPage from "./SettingPage";
import Sidebar from "../components/Sidebar";
import { styled } from "styled-components";

const MainPageWrapper = styled.div`
  flex-direction: column;
  display: flex;
  height: 100%;
  width: 100vw;
`;

const CenterWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

export default function MainPage() {
  return (
    <MainPageWrapper>
      <Sidebar />
      <CenterWrapper>
        <Routes>
          <Route path="/roomlist" element={<RoomListPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route
            path="*"
            element={
              <div>
                <h2>404 Page not found</h2>
              </div>
            }
          />
          <Route path="/" element={<Navigate to="roomlist" />} />
        </Routes>
      </CenterWrapper>
    </MainPageWrapper>
  );
}
