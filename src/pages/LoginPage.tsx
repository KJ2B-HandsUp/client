import { NavLink } from "react-router-dom";
import {
  LoginPageWrapper,
  VideoBackground,
  TitleWrapper,
} from "../styled/login.styled";
//import Sidebar from "../components/Sidebar";
import { SidebarItemType } from "../types/sidebar.type";
import { playBtnAudio } from "../utils/audio";
import { DataConsumer } from "mediasoup-client/lib/DataConsumer";

export const items: SidebarItemType[] = [
  {
    name: "Login",
    path: "login",
  },
];

export default function LoginPage() {
  const requestLogin = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_LOGINSERVER_IP}/authorize`,
      {
        method: "GET",
      },
    );
    console.log(response);
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/back.mp4" type="video/mp4" />
      </VideoBackground>
      {
        //<Sidebar items={items} />
      }
      <LoginPageWrapper>
        <header>
          <TitleWrapper>Hands Up!</TitleWrapper>
        </header>
        <button onClick={requestLogin}>카카오 로그인</button>
        <NavLink to="/main" onClick={playBtnAudio}>
          <img alt="카카오 로그인" src="/kakao_login_medium.png" />
        </NavLink>
      </LoginPageWrapper>
    </>
  );
}
