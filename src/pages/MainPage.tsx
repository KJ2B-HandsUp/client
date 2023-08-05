import { Routes, Route, Navigate } from "react-router-dom";
import RoomListPage from "./RoomListPage";
import RankingPage from "./RankingPage";
import HomePage from "./HomePage";
import TutorialPage from "./TutorialPage";

import { styled } from "styled-components";
import { SidebarItemType } from "../types/sidebar.type";
import { VideoBackground, TitleWrapper } from "../styled/login.styled";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import PageMotionWrapper from "../motions/PageMotionWrapper";

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

export const pageItems: SidebarItemType[] = [
  { name: "Home", path: "home", components: <HomePage /> },
  { name: "RoomList", path: "roomlist", components: <RoomListPage /> },
  { name: "Ranking", path: "ranking", components: <RankingPage /> },
  { name: "Tutorial", path: "tutorial", components: <TutorialPage /> },
];

export default function MainPage() {
  const location = useLocation();

  return (
    <>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/back.mp4" type="video/mp4" />
      </VideoBackground>
      <MainPageWrapper>
        <header>
          <TitleWrapper>Hands Up!</TitleWrapper>
        </header>
        <CenterWrapper>
          <Routes key={location.pathname}>
            {pageItems.map((item, idx) => (
              <Route
                path={`/${item.path}`}
                key={idx}
                element={item.components}
              />
            ))}
            <Route
              path="*"
              element={
                <div>
                  <h2>404 Page not found</h2>
                </div>
              }
            />
            <Route path="/" element={<Navigate to="home" />} />
          </Routes>
        </CenterWrapper>
      </MainPageWrapper>
    </>
  );
}
