import { useEffect, useState } from "react";
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
import { bgmAudio, playBtnAudio } from "../utils/audio";

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
  function getUserProfile() {
    axios
      .get("http://localhost:4000/profile", {
        withCredentials: true,
      })
      .then(({ data }) => {
        console.log(data);
        setMyProfile({
          id: 1,
          nickname: data.properties["nickname"],
          profile_image_url: data.properties["profile_image"],
        });
      })
      .catch((err) => {
        console.log(err);
        setMyProfile({
          id: 1,
          nickname: "최광민",
          profile_image_url:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDg0NDQ8PDQ0NDw0NDg0NDQ8NDg4NFREWFhQdExMYHCghGBolGxUTITEhJSkrLi4wFx8zODMsNygtLisBCgoKDg0OGhAQGC4dICU3KystKysrLS0rLS0tLSstLS0tLS0tLS0rLS0rLS0tLSstLS0tKy0tKzcrKysrKy0rN//AABEIAOAA4QMBIgACEQEDEQH/xAAaAAEBAQADAQAAAAAAAAAAAAAAAQUCAwQG/8QAMBABAAIAAggDBwUBAAAAAAAAAAECAwQFERIhMUFRcTJSYSKBkaGxweETM3KS0UL/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQMCBAX/xAAeEQEBAQEAAwADAQAAAAAAAAAAAQIRAzFBEiFRE//aAAwDAQACEQMRAD8A+rBX0XzUFQUFQQFAQUBBQEFAQUBBQEFAQVABUABQQAAABUUAABFAAAAAAAAAAAAAAAAAAAAAAAQAAAVRAFEUAAQAAAAAAAAAAAAEBVEAUQBRAAAQAFAAFRQABAAAAAcqUtbdWJntGt31yGLPKI7zCdkWS15h6p0fi9IntaHRiYN6eKsx66t3xOw5Y4AKgACACgAAAAAAAgAKAAKigACAAER0aOV0fHHE/r/rno7K7MbdvFPD0h7WWt/I2zj7UrWIjVEao6QoM2gADx5nIVtvp7Nun/M/4y71mszExqmOT6B5s7loxK648ccPX0d53/WesfYxwGzFABQAAAAAAAQAFAAFRQABB3ZPC271jlxntDpaGia+O3aHOryOsztaIDB6AAAAAAGRpLC2b644X3+/m8rU0rXXSJ6W+Ustvi9jDc5UAdOQAAAAAAAAAAABUUAAQaeifDfvH0Zj3aKvqtavmjXHeHO/TvHtpgMG4AAAAADy6T/bnvVkNLS191a9Z2ma2x6Yb9oA7cgAAAAAAAgAKAAKigACDlhYk1tFo4xOtxBW/h3i0RaOExrcmPks1+nOqd9J4+ktetomImJ1xPCYYazxvnXVAcugAAmdW+eEcRl5/N7XsU8POev4WTrnV5HnzWN+pebcuEdnUDdggCgAAAAAAAIACgACooAAgAA7cDMXw59md3Os8JdQitXC0jSfFE1n4w9FcxhzwvX4wwkc3EdzyVvzjUjjav8AaHRi5/Drwnan0/1jqn+cL5K9GYzd8Td4a+WPu84O5OOLegCogAoAAAAAAAIACgACooAAgO7L5a2Jw3RztPBp4GTpTfq2rdZ+zm6kdzNrMwspiX4V1R1ndD14ejPNb3Vj7y0Bnd1pMR5a6Pwo5TPeZ+znGTwvJHzd457XX4x0zlMLyR83C2Qwp5THaZekO0/GM/E0ZH/NvdaHlxcniU4xrjrXe2h1N1zcR88NrHylL8Y1T5o3SzMzlbYfHfXzR92k1KzuLHnAdOQAAAAAAAQAFAAFRQHryWT2/atup052/Djkct+pOufBXj6z0bERqZ71z9R3jPf3UrERGqI1RHKFBk2AAAAAAAACY17p4SAMvPZHZ13p4eden4eF9GyNIZXYnar4Z4x5Za418rLWfseMBozAAAAABAAUAAcqUm0xWOMzqhxe/RWFrmbzy3R35pbyLJ2tDBw4pWKxy+cuYPO9AAAAAAAAAAAACuOJSLRNZ4TulyBHz+PhTS01nl84cGnpbC3ReOW6e3JmN83sYanKAOkAAABAAUAAbeRps4dfWNqfexIh9FWNURHSNTPyNPH7AGTUAAAAAAAAAAABQBHXj02qWr1ifiwH0b5/MV1XvHS0/Vp46z24ANWYAAAIACgAOWF4q/yj6voHz+F4q/yr9X0LLyNfGgDNoAAAAAAAAAAAAoAgw89+7fu3GHnv3b9/s78ftxv06AGzIAAAB//Z",
        });
      });
  }

  useEffect(() => {
    // 로그인 유저 정보
    getUserProfile();

    // 기본 브금
    bgmAudio.loop = true; // 무한 반복 설정
    bgmAudio.play(); // 음원 재생 시작

    return () => {
      bgmAudio.pause(); // 컴포넌트 언마운트 시 음원 정지
    };
  }, []);

  return (
    <>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/back.mp4" type="video/mp4" />
      </VideoBackground>
      <MainPageWrapper>
        <MemoizedUserProfile user={myProfile} />
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
