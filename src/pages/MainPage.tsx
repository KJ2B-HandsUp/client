import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import RoomListPage from "./RoomListPage";
import RankingPage from "./RankingPage";
import HomePage from "./HomePage";
import TutorialPage from "./TutorialPage";

import { styled } from "styled-components";
import { SidebarItemType } from "../types/sidebar.type";
import { VideoBackground } from "../styled/login.styled";
import { AnimatePresence } from "framer-motion";
import PageMotionWrapper from "../motions/PageMotionWrapper";
import axios from "axios";
import { UserType } from "../types/game.type";
import { MemoizedUserProfile } from "../components/UserProfile";
import LobbyBGMPlayer from "../components/LobbyBGMPlayer";

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
  const [myProfile, setMyProfile] = useState<UserType>({
    userId: 0,
  });
  const location = useLocation();

  useEffect(() => {
    const getUserProfile = () => {
      axios
        .get(`${import.meta.env.VITE_LOGINSERVER_IP}/profile`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          console.log(data);
          setMyProfile({
            userId: 1,
            nickname: data.data.properties["nickname"] as string,
            profile_image_url: data.data.properties["profile_image"] as string,
          });
        })
        .catch((err) => {
          console.log(err);
          setMyProfile({
            userId: 1,
            nickname: "김민석",
            profile_image_url:
              "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDg0NDQ8PDQ0NDw0NDg0NDQ8NDg4NFREWFhQdExMYHCghGBolGxUTITEhJSkrLi4wFx8zODMsNygtLisBCgoKDg0OGhAQGC4dICU3KystKysrLS0rLS0tLSstLS0tLS0tLS0rLS0rLS0tLSstLS0tKy0tKzcrKysrKy0rN//AABEIAOAA4QMBIgACEQEDEQH/xAAaAAEBAQADAQAAAAAAAAAAAAAAAQUCAwQG/8QAMBABAAIAAggDBwUBAAAAAAAAAAECAwQFERIhMUFRcTJSYSKBkaGxweETM3KS0UL/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQMCBAX/xAAeEQEBAQEAAwADAQAAAAAAAAAAAQIRAzFBEiFRE//aAAwDAQACEQMRAD8A+rBX0XzUFQUFQQFAQUBBQEFAQUBBQEFAQVABUABQQAAABUUAABFAAAAAAAAAAAAAAAAAAAAAAAQAAAVRAFEUAAQAAAAAAAAAAAAEBVEAUQBRAAAQAFAAFRQABAAAAAcqUtbdWJntGt31yGLPKI7zCdkWS15h6p0fi9IntaHRiYN6eKsx66t3xOw5Y4AKgACACgAAAAAAAgAKAAKigACAAER0aOV0fHHE/r/rno7K7MbdvFPD0h7WWt/I2zj7UrWIjVEao6QoM2gADx5nIVtvp7Nun/M/4y71mszExqmOT6B5s7loxK648ccPX0d53/WesfYxwGzFABQAAAAAAAQAFAAFRQABB3ZPC271jlxntDpaGia+O3aHOryOsztaIDB6AAAAAAGRpLC2b644X3+/m8rU0rXXSJ6W+Ustvi9jDc5UAdOQAAAAAAAAAAABUUAAQaeifDfvH0Zj3aKvqtavmjXHeHO/TvHtpgMG4AAAAADy6T/bnvVkNLS191a9Z2ma2x6Yb9oA7cgAAAAAAAgAKAAKigACDlhYk1tFo4xOtxBW/h3i0RaOExrcmPks1+nOqd9J4+ktetomImJ1xPCYYazxvnXVAcugAAmdW+eEcRl5/N7XsU8POev4WTrnV5HnzWN+pebcuEdnUDdggCgAAAAAAAIACgACooAAgAA7cDMXw59md3Os8JdQitXC0jSfFE1n4w9FcxhzwvX4wwkc3EdzyVvzjUjjav8AaHRi5/Drwnan0/1jqn+cL5K9GYzd8Td4a+WPu84O5OOLegCogAoAAAAAAAIACgACooAAgO7L5a2Jw3RztPBp4GTpTfq2rdZ+zm6kdzNrMwspiX4V1R1ndD14ejPNb3Vj7y0Bnd1pMR5a6Pwo5TPeZ+znGTwvJHzd457XX4x0zlMLyR83C2Qwp5THaZekO0/GM/E0ZH/NvdaHlxcniU4xrjrXe2h1N1zcR88NrHylL8Y1T5o3SzMzlbYfHfXzR92k1KzuLHnAdOQAAAAAAAQAFAAFRQHryWT2/atup052/Djkct+pOufBXj6z0bERqZ71z9R3jPf3UrERGqI1RHKFBk2AAAAAAAACY17p4SAMvPZHZ13p4eden4eF9GyNIZXYnar4Z4x5Za418rLWfseMBozAAAAABAAUAAcqUm0xWOMzqhxe/RWFrmbzy3R35pbyLJ2tDBw4pWKxy+cuYPO9AAAAAAAAAAAACuOJSLRNZ4TulyBHz+PhTS01nl84cGnpbC3ReOW6e3JmN83sYanKAOkAAABAAUAAbeRps4dfWNqfexIh9FWNURHSNTPyNPH7AGTUAAAAAAAAAAABQBHXj02qWr1ifiwH0b5/MV1XvHS0/Vp46z24ANWYAAAIACgAOWF4q/yj6voHz+F4q/yr9X0LLyNfGgDNoAAAAAAAAAAAAoAgw89+7fu3GHnv3b9/s78ftxv06AGzIAAAB//Z",
          });
        });
    };
    getUserProfile();
  }, []);

  return (
    <>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/back.mp4" type="video/mp4" />
      </VideoBackground>
      <MainPageWrapper>
        <MemoizedUserProfile
          user={myProfile}
          style={{ top: "40px", right: "40px" }}
        />
        <LobbyBGMPlayer />
        <CenterWrapper>
          <AnimatePresence mode="wait">
            <Routes key={location.pathname} location={location}>
              {pageItems.map((item, idx) => (
                <Route
                  path={`/${item.path}`}
                  key={idx}
                  element={
                    <PageMotionWrapper>{item.components}</PageMotionWrapper>
                  }
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
          </AnimatePresence>
        </CenterWrapper>
      </MainPageWrapper>
    </>
  );
}
