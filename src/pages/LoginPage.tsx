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
        <NavLink to="/main">
          <img alt="카카오 로그인" src="/kakao_login_medium.png" />
        </NavLink>
      </LoginPageWrapper>
    </>
  );
}
