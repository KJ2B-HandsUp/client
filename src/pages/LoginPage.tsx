import { NavLink } from "react-router-dom";
import {
  LoginPageWrapper,
  VideoBackground,
  TitleWrapper,
} from "../styled/login.styled";
import Sidebar from "../components/Sidebar";
import { SidebarItemType } from "../types/sidebar.type";

const items: SidebarItemType[] = [
  {
    name: "Login",
    path: "login",
  },
];

export default function LoginPage() {
  const requestLogin = async () => {
    const response = await fetch("http://localhost:4000/authorize", {
      method: "GET",
    });
    const data = await response.json();
    window.location.href = data.redirectUrl;
  };
  return (
    <>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/back.mp4" type="video/mp4" />
      </VideoBackground>
      <Sidebar items={items} />
      <LoginPageWrapper>
        <header>
          <TitleWrapper>Hands Up!</TitleWrapper>
        </header>
        <button onClick={requestLogin}>카카오 로그인</button>
        <NavLink to="/main">
          <img alt="카카오 로그인" src="/kakao_login_medium.png" />
        </NavLink>
      </LoginPageWrapper>
    </>
  );
}
